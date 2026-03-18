import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upsertScene } from './storage';
import { speak, stopSpeaking } from './speech';
import type { AvatarMode, Emotion, Scene, VoiceStyle } from './types';

const EMOTIONS: Emotion[] = [
  'Neutral',
  'Calm',
  'Supportive',
  'Angry',
  'Critical',
  'Anxious',
];

const VOICES: VoiceStyle[] = [
  'Default',
  'Warm',
  'Firm',
  'Soft',
  'Harsh',
];

export default function CreateScene() {
  const nav = useNavigate();

  const [title, setTitle] = useState('');
  const [line, setLine] = useState('');
  const [emotion, setEmotion] = useState<Emotion>('Neutral');
  const [voice, setVoice] = useState<VoiceStyle>('Default');
  const [intensity, setIntensity] = useState(5);

  const [avatarMode, setAvatarMode] = useState<AvatarMode>('none');
  const [avatarDescription, setAvatarDescription] = useState('');
  const [avatarImageDataUrl, setAvatarImageDataUrl] = useState<string>('');

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setAvatarImageDataUrl(result);
      setAvatarMode('upload');
    };
    reader.readAsDataURL(file);
  }

  const scene: Scene = useMemo(() => {
    const now = Date.now();

    return {
      id: crypto.randomUUID(),
      title: title.trim() || 'Untitled scene',
      line: line.trim(),
      emotion,
      intensity,
      voice,
      createdAt: now,
      updatedAt: now,
      avatarMode,
      avatarDescription: avatarDescription.trim() || undefined,
      avatarImageDataUrl: avatarImageDataUrl || undefined,
    };
  }, [title, line, emotion, intensity, voice, avatarMode, avatarDescription, avatarImageDataUrl]);

  function save() {
    if (!line.trim()) {
      alert('Please enter a line of text');
      return;
    }

    upsertScene(scene);
    nav('/library');
  }

  return (
    <div className="card">
      <h2>Create Scene</h2>

      <div className="field">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Inner critic voice"
        />
      </div>

      <div className="field">
        <label>Scripted line</label>
        <textarea
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder="Write what this inner voice says..."
        />
      </div>

      <div className="field">
        <label>Emotion</label>
        <select
          value={emotion}
          onChange={(e) => setEmotion(e.target.value as Emotion)}
        >
          {EMOTIONS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Intensity: {intensity}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
        />
      </div>

      <div className="field">
        <label>Voice</label>
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value as VoiceStyle)}
        >
          {VOICES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Avatar source</label>
        <div className="row">
          <button
            type="button"
            className={`btn ${avatarMode === 'upload' ? '' : 'secondary'}`}
            onClick={() => setAvatarMode('upload')}
          >
            Upload image
          </button>
          <button
            type="button"
            className={`btn ${avatarMode === 'describe' ? '' : 'secondary'}`}
            onClick={() => setAvatarMode('describe')}
          >
            Describe avatar
          </button>
          <button
            type="button"
            className={`btn ${avatarMode === 'none' ? '' : 'secondary'}`}
            onClick={() => setAvatarMode('none')}
          >
            No avatar
          </button>
        </div>
      </div>

      {avatarMode === 'upload' && (
        <div className="field">
          <label>Upload image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {avatarImageDataUrl && (
            <div style={{ marginTop: 12 }}>
              <img
                src={avatarImageDataUrl}
                alt="avatar preview"
                style={{
                  width: 180,
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: 16,
                  border: '1px solid #ddd',
                }}
              />
            </div>
          )}
        </div>
      )}

      {avatarMode === 'describe' && (
        <div className="field">
          <label>Avatar description</label>
          <textarea
            value={avatarDescription}
            onChange={(e) => setAvatarDescription(e.target.value)}
            placeholder="Example: calm adult woman, warm eyes, soft cardigan, supportive presence..."
          />
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="btn secondary"
          onClick={() => speak(line, emotion, intensity, voice)}
        >
          ▶ Preview
        </button>

        <button className="btn secondary" onClick={stopSpeaking}>
          ⏹ Stop
        </button>

        <button className="btn" onClick={save}>
          💾 Save
        </button>
      </div>
    </div>
  );
}

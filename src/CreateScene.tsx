import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upsertScene } from './storage';
import { speak, stopSpeaking } from './speech';
import type { Emotion, Scene, VoiceStyle } from './types';

/* ===== constants ===== */

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

/* ===== component ===== */

export default function CreateScene() {
  const nav = useNavigate();

  const [title, setTitle] = useState('');
  const [line, setLine] = useState('');
  const [emotion, setEmotion] = useState<Emotion>('Neutral');
  const [voice, setVoice] = useState<VoiceStyle>('Default');
  const [intensity, setIntensity] = useState(5);

  const scene: Scene = useMemo(
    () => ({
      id: crypto.randomUUID(),
      title: title.trim() || 'Untitled scene',
      line: line.trim(),
      emotion,
      intensity,
      voice,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
    [title, line, emotion, intensity, voice]
  );

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

      {/* Title */}
      <div className="field">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Inner critic voice"
        />
      </div>

      {/* Line */}
      <div className="field">
        <label>Scripted line</label>
        <textarea
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder="Write what this inner voice says..."
        />
      </div>

      {/* Emotion */}
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

      {/* Intensity */}
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

      {/* Voice */}
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

      {/* Actions */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
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

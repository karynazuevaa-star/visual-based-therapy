import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import type { Emotion, Scene, VoiceStyle } from '../types';
import { upsertScene } from './storage';
import { speak, stopSpeaking } from '../speech';

const EMOTIONS: Emotion[] = ['Neutral', 'Calm', 'Supportive', 'Angry', 'Critical', 'Anxious'];
const VOICES: VoiceStyle[] = ['Default', 'Warm', 'Firm', 'Soft', 'Harsh'];

const placeholderAvatar =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#dbeafe"/>
        <stop offset="1" stop-color="#fef3c7"/>
      </linearGradient>
    </defs>
    <rect width="256" height="256" fill="url(#g)"/>
    <circle cx="128" cy="98" r="44" fill="#111827" opacity="0.12"/>
    <rect x="58" y="154" width="140" height="68" rx="34" fill="#111827" opacity="0.12"/>
    <text x="128" y="236" text-anchor="middle" font-family="Arial" font-size="14" fill="#334155">Avatar</text>
  </svg>`);

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image.'));
    reader.readAsDataURL(file);
  });
}

export default function CreateScene() {
  const nav = useNavigate();

  const [title, setTitle] = useState('New Scene');
  const [avatarDescription, setAvatarDescription] = useState('');
  const [avatarImageDataUrl, setAvatarImageDataUrl] = useState<string | undefined>(undefined);

  const [emotion, setEmotion] = useState<Emotion>('Neutral');
  const [intensity, setIntensity] = useState(3);
  const [voice, setVoice] = useState<VoiceStyle>('Default');
  const [line, setLine] = useState('');

  const avatarToShow = useMemo(() => avatarImageDataUrl || placeholderAvatar, [avatarImageDataUrl]);

  async function onUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await readFileAsDataUrl(f);
    setAvatarImageDataUrl(url);
  }

  function previewVoice() {
    if (!line.trim()) return;
    speak(line.trim(), emotion, intensity, voice);
  }

  function save() {
    const now = new Date().toISOString();
    const scene: Scene = {
      id: nanoid(),
      title: title.trim() || 'Untitled scene',
      avatarDescription: avatarDescription.trim(),
      avatarImageDataUrl,
      line: line.trim(),
      emotion,
      intensity,
      voice,
      createdAt: now,
    };

    if (!scene.line) {
      alert('Please write a line for the avatar.');
      return;
    }

    upsertScene(scene);
    stopSpeaking();
    nav(`/scene/${scene.id}`);
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Create a scripted scene</h2>
        <p className="muted">
          In v1, the therapist scripts the avatar’s line and chooses emotion + intensity.
          Later versions can add role-based interactive dialogue.
        </p>

        <div className="field">
          <label>Scene title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Inner Critic — low intensity" />
        </div>

        <div className="field">
          <label>Avatar description (who is this?)</label>
          <textarea
            value={avatarDescription}
            onChange={(e) => setAvatarDescription(e.target.value)}
            placeholder="e.g., 'sarcastic male inner critic, ~40, dismissive tone' or 'wise adult, calm and supportive'"
          />
          <div className="hint">Tip: keep it short, like a therapist note.</div>
        </div>

        <div className="field">
          <label>Avatar image</label>
          <div className="avatarWrap">
            <img className="avatar" src={avatarToShow} alt="avatar" />
            <div style={{ flex: 1 }}>
              <div className="row">
                <input type="file" accept="image/*" onChange={onUploadImage} />
              </div>
              <div className="hint" style={{ marginTop: 8 }}>
                This MVP stores images locally in your browser. AI generation can be added later.
              </div>
            </div>
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Emotion</label>
              <select value={emotion} onChange={(e) => setEmotion(e.target.value as any)}>
                {EMOTIONS.map((em) => (
                  <option key={em} value={em}>
                    {em}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Voice style</label>
              <select value={voice} onChange={(e) => setVoice(e.target.value as any)}>
                {VOICES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="field" style={{ marginTop: 0 }}>
              <label>Emotion intensity (1–5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
              />
              <div className="hint">Use for graded exposure: from minimal → strong.</div>
            </div>
          </div>
        </div>

        <div className="field">
          <label>What should the avatar say?</label>
          <textarea value={line} onChange={(e) => setLine(e.target.value)} placeholder="Write one line. Example: “You always mess everything up.”" />
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn secondary" onClick={previewVoice} disabled={!line.trim()}>
            Preview voice
          </button>
          <button className="btn" onClick={save}>
            Save & open reflection
          </button>
        </div>

        <p className="hint" style={{ marginTop: 12 }}>
          Safety note: this is a professional tool prototype. Use clinical judgment and keep a debrief/reflection step.
        </p>
      </div>

      <div className="card">
        <h2>How to use in-session</h2>
        <ol className="muted" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Create a scene (role, line, emotion, intensity).</li>
          <li>Play the line. Observe client’s feelings, thoughts, body response.</li>
          <li>Debrief: What happened? What did you notice? What’s the alternative voice?</li>
          <li>Adjust intensity or switch roles (e.g., Wise Adult).</li>
        </ol>

        <div className="hr" />

        <h2>Suggested templates</h2>
        <div className="list">
          <div className="item">
            <div>
              <h3>Inner Critic — low → high</h3>
              <p className="muted">Create 3 scenes with intensity 2 / 3 / 5.</p>
            </div>
          </div>
          <div className="item">
            <div>
              <h3>Wise Adult — supportive repair</h3>
              <p className="muted">Same situation, new voice: warm + supportive emotion.</p>
            </div>
          </div>
          <div className="item">
            <div>
              <h3>Anxious part — worry spiral</h3>
              <p className="muted">Emotion “Anxious”, intensity 4, faster rate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

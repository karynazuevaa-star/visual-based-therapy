import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { upsertScene } from './storage';
import { speak, stopSpeaking } from './speech';

/* ===== types (локально, чтобы не ломалась сборка) ===== */

export type Emotion =
  | 'Neutral'
  | 'Calm'
  | 'Supportive'
  | 'Angry'
  | 'Critical'
  | 'Anxious';

export type VoiceStyle =
  | 'Default'
  | 'Warm'
  | 'Firm'
  | 'Soft'
  | 'Harsh';

export type Scene = {
  id: string;
  title: string;
  text: string;
  emotion: Emotion;
  voice: VoiceStyle;
};

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

export default function CreateScene() {
  const nav = useNavigate();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState<Emotion>('Neutral');
  const [voice, setVoice] = useState<VoiceStyle>('Default');

  const scene: Scene = useMemo(
    () => ({
      id: nanoid(),
      title,
      text,
      emotion,
      voice,
    }),
    [title, text, emotion, voice]
  );

  function save() {
    upsertScene(scene);
    nav('/library');
  }

  return (
    <div>
      <h2>Create Scene</h2>

      <label>
        Title
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>

      <label>
        Text
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>

      <label>
        Emotion
        <select
          value={emotion}
          onChange={e => setEmotion(e.target.value as Emotion)}
        >
          {EMOTIONS.map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </label>

      <label>
        Voice
        <select
          value={voice}
          onChange={e => setVoice(e.target.value as VoiceStyle)}
        >
          {VOICES.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => speak(text)}>▶ Preview</button>
        <button onClick={stopSpeaking}>⏹ Stop</button>
        <button onClick={save}>💾 Save</button>
      </div>
    </div>
  );
}

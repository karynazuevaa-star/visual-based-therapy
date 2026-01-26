import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Scene } from '../types';
import { getScene, upsertScene } from './storage';
import { speak, stopSpeaking } from '../speech';

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

export default function SceneDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const initial = useMemo(() => (id ? getScene(id) : undefined), [id]);
  const [scene, setScene] = useState<Scene | undefined>(initial);

  const [feelings, setFeelings] = useState(scene?.reflection?.feelings || '');
  const [thoughts, setThoughts] = useState(scene?.reflection?.thoughts || '');
  const [body, setBody] = useState(scene?.reflection?.body || '');
  const [nextStep, setNextStep] = useState(scene?.reflection?.nextStep || '');

  if (!scene) {
    return (
      <div className="card">
        <h2>Scene not found</h2>
        <p className="muted">This scene might have been deleted or is not available in this browser.</p>
        <Link className="btn secondary" to="/library">Back to library</Link>
      </div>
    );
  }

  const avatar = scene.avatarImageDataUrl || placeholderAvatar;

  function play() {
    speak(scene.line, scene.emotion, scene.intensity, scene.voice);
  }

  function saveReflection() {
    const next: Scene = {
      ...scene,
      reflection: {
        feelings: feelings.trim(),
        thoughts: thoughts.trim(),
        body: body.trim(),
        nextStep: nextStep.trim(),
      },
    };
    upsertScene(next);
    setScene(next);
    alert('Saved.');
  }

  function done() {
    stopSpeaking();
    nav('/library');
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>{scene.title}</h2>
            <div className="muted small">
              {new Date(scene.createdAt).toLocaleString()} • {scene.emotion} • intensity {scene.intensity} • voice {scene.voice}
            </div>
          </div>
          <div className="row">
            <button className="btn secondary" onClick={play}>Play line</button>
            <button className="btn" onClick={done}>Done</button>
          </div>
        </div>

        <div className="field">
          <label>Avatar</label>
          <div className="avatarWrap">
            <img className="avatar" src={avatar} alt="avatar" />
            <div style={{ flex: 1 }}>
              <div className="badge">Role note</div>
              <div className="muted" style={{ marginTop: 8 }}>
                {scene.avatarDescription ? scene.avatarDescription : '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Scripted line</label>
          <textarea value={scene.line} readOnly />
        </div>
      </div>

      <div className="card">
        <h2>Reflection / debrief</h2>
        <p className="muted">
          Capture the client’s response and plan the next iteration (change intensity, switch role, add supportive voice).
        </p>

        <div className="field">
          <label>Feelings (emotions)</label>
          <textarea value={feelings} onChange={(e) => setFeelings(e.target.value)} placeholder="What did the client feel during / after?" />
        </div>

        <div className="field">
          <label>Thoughts</label>
          <textarea value={thoughts} onChange={(e) => setThoughts(e.target.value)} placeholder="What did the client think / believe?" />
        </div>

        <div className="field">
          <label>Body sensations</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tension, heartbeat, breathing, etc." />
        </div>

        <div className="field">
          <label>Next step</label>
          <textarea value={nextStep} onChange={(e) => setNextStep(e.target.value)} placeholder="Adjust intensity, add Wise Adult, homework, etc." />
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={saveReflection}>Save reflection</button>
          <Link className="btn secondary" to="/create">Create another scene</Link>
          <Link className="btn secondary" to="/library">Back to library</Link>
        </div>

        <div className="hr" />
        <div className="muted small">
          Note: For a real product, add consent UX, safety stops, and institute-level templates.
        </div>
      </div>
    </div>
  );
}

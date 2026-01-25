import React from 'react';
import { Link } from 'react-router-dom';
import { loadScenes } from '../storage';

export default function Home() {
  const count = loadScenes().length;

  return (
    <div className="grid">
      <div className="card">
        <h2>What this MVP does</h2>
        <p className="muted">
          A prototype for therapists and training institutes to <b>visualize therapeutic roles</b> (inner critic, wise adult, anxious part)
          using an avatar + scripted line + emotion + intensity, followed by reflection.
          <br /><br />
          This build uses <b>local-only storage</b> (your browser) and <b>built-in text-to-speech</b> (Web Speech API) as a placeholder for voice engines.
        </p>
        <div className="hr" />
        <div className="row">
          <Link className="btn" to="/create">Create a new scene</Link>
          <Link className="btn secondary" to="/library">Open my library</Link>
        </div>
        <p className="hint" style={{ marginTop: 12 }}>
          Tip: create a scene for “minimal criticism” and another for “high criticism” to demonstrate graded exposure / frustration tolerance.
        </p>
      </div>

      <div className="card">
        <h2>Quick stats</h2>
        <div className="kpi">
          <div className="card" style={{ boxShadow: 'none' }}>
            <div className="muted small">Scenes saved</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{count}</div>
          </div>
          <div className="card" style={{ boxShadow: 'none' }}>
            <div className="muted small">Mode</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Scripted (v1)</div>
          </div>
        </div>

        <div className="hr" />

        <h2>Roadmap ideas</h2>
        <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
          <li>AI avatar generation + 3D/rigged avatars</li>
          <li>Role-based interactive dialogue (LLM-in-role)</li>
          <li>Institute mode: classroom demos + templates</li>
          <li>Session export: PDF notes, share link</li>
        </ul>
      </div>
    </div>
  );
}

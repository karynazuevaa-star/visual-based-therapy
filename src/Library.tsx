import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Scene } from '../types';
import { deleteScene, loadScenes } from './storage';

export default function Library() {
  const [scenes, setScenes] = useState<Scene[]>([]);

  useEffect(() => {
    setScenes(loadScenes());
  }, []);

  function remove(id: string) {
    if (!confirm('Delete this scene?')) return;
    const next = deleteScene(id);
    setScenes(next);
  }

  return (
    <div className="card">
      <h2>My Library</h2>
      <p className="muted">Saved scenes live in your browser (localStorage). Export & cloud sync can be added later.</p>

      <div className="row" style={{ marginTop: 10 }}>
        <Link className="btn" to="/create">Create new scene</Link>
      </div>

      <div className="list">
        {scenes.length === 0 ? (
          <div className="muted" style={{ marginTop: 12 }}>No scenes yet. Create your first one.</div>
        ) : (
          scenes.map((s) => (
            <div key={s.id} className="item">
              <div style={{ minWidth: 0 }}>
                <h3>{s.title}</h3>
                <p className="muted small">
                  {new Date(s.createdAt).toLocaleString()} • {s.emotion} • intensity {s.intensity} • voice {s.voice}
                </p>
                <p className="muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 680 }}>
                  “{s.line}”
                </p>
              </div>
              <div className="rightActions">
                <Link className="btn secondary" to={`/scene/${s.id}`}>Open</Link>
                <button className="btn danger" onClick={() => remove(s.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

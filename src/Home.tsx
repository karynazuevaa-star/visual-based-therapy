import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="card">
      <h2>Purpose</h2>
      <p className="muted">
        A professional prototype for therapists and institutes to visualize therapeutic roles
        such as the inner critic or wise adult.
      </p>

      <ul>
        <li>Avatar or role note</li>
        <li>Scripted line</li>
        <li>Emotion and intensity</li>
        <li>Voice preview</li>
        <li>Reflection and debrief notes</li>
      </ul>

      <div className="row" style={{ marginTop: 16 }}>
        <Link className="btn" to="/create">
          Create Scene
        </Link>
        <Link className="btn secondary" to="/library">
          Open Library
        </Link>
      </div>
    </div>
  );
}

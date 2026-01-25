import React from 'react';
import { Link } from 'react-router-dom';
import { loadScenes } from './storage';

export default function Home() {
  const scenes = loadScenes();

  return (
    <div>
      <h2>My Scenes</h2>

      {scenes.length === 0 && (
        <p>No scenes yet. Create your first one.</p>
      )}

      <ul>
        {scenes.map(scene => (
          <li key={scene.id}>
            <Link to={`/scene/${scene.id}`}>
              {scene.title || 'Untitled Scene'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

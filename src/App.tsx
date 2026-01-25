import React from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import Home from './Home';
import CreateScene from './CreateScene';
import Library from './Library';
import SceneDetail from './SceneDetail';

function Topbar() {
  const loc = useLocation();

  const isActive = (path: string) =>
    loc.pathname === path || loc.pathname.startsWith(path + '/');

  return (
    <div className="topbar">
      <div className="brand">
        <h1>Visual Based Therapy (MVP)</h1>
        <span>Professional visualization tool for therapists — demo build</span>
      </div>

      <div className="nav">
        <NavLink
          className={() => 'pill' + (isActive('/') ? ' active' : '')}
          to="/"
        >
          Home
        </NavLink>

        <NavLink
          className={() => 'pill' + (isActive('/create') ? ' active' : '')}
          to="/create"
        >
          Create Scene
        </NavLink>

        <NavLink
          className={() => 'pill' + (isActive('/library') ? ' active' : '')}
          to="/library"
        >
          My Library
        </NavLink>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="container">
      <Topbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateScene />} />
        <Route path="/library" element={<Library />} />
        <Route path="/scene/:id" element={<SceneDetail />} />
      </Routes>
    </div>
  );
}

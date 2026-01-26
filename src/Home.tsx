import React from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';

import Home from './Home';
import CreateScene from './CreateScene';
import Library from './Library';
import SceneDetail from './SceneDetail';

function Topbar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/');

  return (
    <div className="topbar">
      <div className="brand">
        <h1>Visual Based Therapy (MVP)</h1>
        <span>
          Professional visualization tool for therapists — demo build
        </span>
      </div>

      <div className="nav">
        <NavLink
          to="/"
          className={() => 'pill' + (isActive('/') ? ' active' : '')}
        >
          Home
        </NavLink>

        <NavLink
          to="/create"
          className={() => 'pill' + (isActive('/create') ? ' active' : '')}
        >
          Create Scene
        </NavLink>

        <NavLink
          to="/library"
          className={() => 'pill' + (isActive('/library') ? ' active' : '')}
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

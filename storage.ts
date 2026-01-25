import type { Scene } from './types';

const KEY = 'vbt_mvp_scenes_v1';

export function loadScenes(): Scene[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Scene[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScenes(scenes: Scene[]) {
  localStorage.setItem(KEY, JSON.stringify(scenes));
}

export function upsertScene(scene: Scene) {
  const scenes = loadScenes();
  const idx = scenes.findIndex(s => s.id === scene.id);
  const next = idx >= 0 ? scenes.map(s => (s.id === scene.id ? scene : s)) : [scene, ...scenes];
  saveScenes(next);
  return next;
}

export function deleteScene(id: string) {
  const scenes = loadScenes();
  const next = scenes.filter(s => s.id !== id);
  saveScenes(next);
  return next;
}

export function getScene(id: string) {
  return loadScenes().find(s => s.id === id);
}

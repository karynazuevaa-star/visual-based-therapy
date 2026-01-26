export type Scene = {
  id: string;
  title?: string;
  createdAt?: number;
  data?: unknown;
};

const STORAGE_KEY = 'vbt_scenes';

export function loadScenes(): Scene[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Scene[];
  } catch (e) {
    console.error('Failed to load scenes', e);
    return [];
  }
}

export function saveScenes(scenes: Scene[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
  } catch (e) {
    console.error('Failed to save scenes', e);
  }
}

export type Scene = {
  id: string;
  title?: string;
  createdAt?: number;
  updatedAt?: number;

  // любые дополнительные поля, которые ты сохраняешь из CreateScene
  emotion?: string;
  voice?: string;
  prompt?: string;
  notes?: string;
};

const STORAGE_KEY = 'vbt_scenes_v1';

export function loadScenes(): Scene[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Scene[];
  } catch (e) {
    console.error('Failed to load scenes', e);
    return [];
  }
}

function saveScenes(scenes: Scene[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
}

/** добавить новую сцену или обновить существующую */
export function upsertScene(scene: Scene): Scene {
  const now = Date.now();
  const scenes = loadScenes();

  const idx = scenes.findIndex((s) => s.id === scene.id);

  if (idx >= 0) {
    const updated: Scene = {
      ...scenes[idx],
      ...scene,
      updatedAt: now,
    };
    scenes[idx] = updated;
    saveScenes(scenes);
    return updated;
  }

  const created: Scene = {
    ...scene,
    createdAt: scene.createdAt ?? now,
    updatedAt: now,
  };

  // добавим в начало списка
  saveScenes([created, ...scenes]);
  return created;
}

export function getSceneById(id: string): Scene | undefined {
  return loadScenes().find((s) => s.id === id);
}

export function deleteScene(id: string) {
  const scenes = loadScenes().filter((s) => s.id !== id);
  saveScenes(scenes);
}

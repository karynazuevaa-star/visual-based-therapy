export type Scene = {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
};

const STORAGE_KEY = 'visual_based_therapy_scenes';

/**
 * Загрузить все сцены
 */
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

/**
 * Сохранить все сцены
 */
export function saveScenes(scenes: Scene[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
}

/**
 * Добавить новую сцену
 */
export function addScene(scene: Scene) {
  const scenes = loadScenes();
  scenes.push(scene);
  saveScenes(scenes);
}

/**
 * Получить сцену по id
 */
export function getSceneById(id: string): Scene | undefined {
  return loadScenes().find(scene => scene.id === id);
}

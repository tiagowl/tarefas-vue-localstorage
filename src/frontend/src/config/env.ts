const env = import.meta.env;

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const APP_TITLE: string = env.VITE_APP_TITLE ?? 'Minhas Tarefas';

export const STORAGE_KEY: string = env.VITE_STORAGE_KEY ?? 'tarefas:data:v1';

export const STORAGE_SCHEMA_VERSION: number = toNumber(env.VITE_STORAGE_SCHEMA_VERSION, 1);

export const PREFERENCES_KEY: string = env.VITE_PREFERENCES_KEY ?? 'tarefas:prefs:v1';

export const PAGE_SIZE: number = toNumber(env.VITE_PAGE_SIZE, 8);

export const SEARCH_DEBOUNCE_MS: number = toNumber(env.VITE_SEARCH_DEBOUNCE_MS, 200);

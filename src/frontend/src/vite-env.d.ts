/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_STORAGE_KEY?: string;
  readonly VITE_STORAGE_SCHEMA_VERSION?: string;
  readonly VITE_PREFERENCES_KEY?: string;
  readonly VITE_PAGE_SIZE?: string;
  readonly VITE_SEARCH_DEBOUNCE_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  /** Definido pelos testes ponta a ponta para manter o estado inicial vazio. */
  __TAREFAS_DISABLE_SEED__?: boolean;
}

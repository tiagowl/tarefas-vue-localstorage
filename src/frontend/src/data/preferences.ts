import { PREFERENCES_KEY } from '@/config/env';
import type { ViewMode } from '@/domain/models';

const VIEW_KEY = `${PREFERENCES_KEY}:view`;

export function loadActiveView(): ViewMode {
  try {
    return localStorage.getItem(VIEW_KEY) === 'kanban' ? 'kanban' : 'list';
  } catch {
    return 'list';
  }
}

export function saveActiveView(view: ViewMode): void {
  try {
    localStorage.setItem(VIEW_KEY, view);
  } catch {
    // Preferência de UI: falha silenciosa é aceitável (não é dado de tarefa).
  }
}

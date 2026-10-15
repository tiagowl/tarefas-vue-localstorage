export type Status = 'todo' | 'doing' | 'done';

export type StatusFilterValue = Status | 'all';

export type ViewMode = 'list' | 'kanban';

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subtasks: Subtask[];
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  name: string;
  status: StatusFilterValue;
}

export interface TaskDraft {
  title: string;
  description?: string;
}

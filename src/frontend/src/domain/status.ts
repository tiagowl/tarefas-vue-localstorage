import type { Status, Subtask } from './models';

export const deriveStatus = (subtasks: Subtask[]): Status => {
  if (subtasks.length === 0) return 'todo';
  const doneCount = subtasks.filter((subtask) => subtask.done).length;
  if (doneCount === 0) return 'todo';
  if (doneCount === subtasks.length) return 'done';
  return 'doing';
};

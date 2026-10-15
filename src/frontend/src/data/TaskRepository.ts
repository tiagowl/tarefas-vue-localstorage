import type { Task } from '@/domain/models';

export interface TaskRepository {
  loadAll(): Task[];
  saveAll(tasks: Task[]): void;
  clear(): void;
  isAvailable(): boolean;
}

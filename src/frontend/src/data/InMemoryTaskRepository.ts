import type { Task } from '@/domain/models';
import type { TaskRepository } from './TaskRepository';

const clone = (tasks: Task[]): Task[] => JSON.parse(JSON.stringify(tasks)) as Task[];

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  constructor(initial: Task[] = []) {
    this.tasks = clone(initial);
  }

  loadAll(): Task[] {
    return clone(this.tasks);
  }

  saveAll(tasks: Task[]): void {
    this.tasks = clone(tasks);
  }

  clear(): void {
    this.tasks = [];
  }

  isAvailable(): boolean {
    return true;
  }
}

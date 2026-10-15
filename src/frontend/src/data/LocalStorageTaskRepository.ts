import { STORAGE_KEY, STORAGE_SCHEMA_VERSION } from '@/config/env';
import type { Task } from '@/domain/models';
import type { TaskRepository } from './TaskRepository';
import { parseTasks, serialize } from './schema';

export class LocalStorageTaskRepository implements TaskRepository {
  private readonly key: string;
  private readonly schemaVersion: number;

  constructor(key: string = STORAGE_KEY, schemaVersion: number = STORAGE_SCHEMA_VERSION) {
    this.key = key;
    this.schemaVersion = schemaVersion;
  }

  loadAll(): Task[] {
    try {
      return parseTasks(localStorage.getItem(this.key), this.schemaVersion);
    } catch {
      return [];
    }
  }

  saveAll(tasks: Task[]): void {
    localStorage.setItem(this.key, serialize(tasks, this.schemaVersion));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  isAvailable(): boolean {
    try {
      const probeKey = `${this.key}:__probe__`;
      localStorage.setItem(probeKey, '1');
      localStorage.removeItem(probeKey);
      return true;
    } catch {
      return false;
    }
  }
}

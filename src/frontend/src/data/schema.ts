import type { Status, Subtask, Task } from '@/domain/models';

export interface StorageEnvelope {
  schemaVersion: number;
  tasks: Task[];
}

const VALID_STATUSES: readonly Status[] = ['todo', 'doing', 'done'];

type Migration = (tasks: unknown[]) => unknown[];

const MIGRATIONS: Record<number, Migration> = {};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSubtask(value: unknown): value is Subtask {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.done === 'boolean'
  );
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    (value.description === undefined || typeof value.description === 'string') &&
    Array.isArray(value.subtasks) &&
    value.subtasks.every(isSubtask) &&
    typeof value.status === 'string' &&
    VALID_STATUSES.includes(value.status as Status) &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

function runMigrations(tasks: unknown[], fromVersion: number, toVersion: number): unknown[] {
  let current = tasks;

  for (let version = fromVersion; version < toVersion; version += 1) {
    const migration = MIGRATIONS[version];
    if (migration) {
      current = migration(current);
    }
  }

  return current;
}

export function createEnvelope(tasks: Task[], schemaVersion: number): StorageEnvelope {
  return { schemaVersion, tasks };
}

export function serialize(tasks: Task[], schemaVersion: number): string {
  return JSON.stringify(createEnvelope(tasks, schemaVersion));
}

/**
 * Converte a string persistida em uma lista de tarefas válidas.
 * Lança em caso de JSON corrompido para que o chamador decida o fallback (US-18).
 */
export function parseTasks(raw: string | null, currentVersion: number): Task[] {
  if (raw === null || raw === '') return [];

  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed)) return [];

  const storedVersion =
    typeof parsed.schemaVersion === 'number'
      ? parsed.schemaVersion
      : typeof parsed.version === 'number'
        ? parsed.version
        : currentVersion;

  const rawTasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
  const migrated = runMigrations(rawTasks, storedVersion, currentVersion);

  return migrated.filter(isTask);
}

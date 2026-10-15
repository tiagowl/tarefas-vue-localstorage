import { describe, expect, it } from 'vitest';
import type { Task } from '@/domain/models';
import { parseTasks, serialize } from '@/data/schema';

const validTask: Task = {
  id: 'task-1',
  title: 'Site institucional',
  description: 'Redesign completo',
  subtasks: [{ id: 'sub-1', title: 'Wireframes', done: false }],
  status: 'todo',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('schema (US-18)', () => {
  it('serializa e desserializa um envelope versionado', () => {
    const raw = serialize([validTask], 1);
    const parsed = parseTasks(raw, 1);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Site institucional');
  });

  it('retorna vazio para dados ausentes', () => {
    expect(parseTasks(null, 1)).toEqual([]);
    expect(parseTasks('', 1)).toEqual([]);
  });

  it('lança em JSON corrompido (tratado pelo repositório)', () => {
    expect(() => parseTasks('{invalid', 1)).toThrow();
  });

  it('descarta tarefas com formato inválido', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      tasks: [validTask, { id: 1, title: 'bad' }],
    });
    expect(parseTasks(raw, 1)).toHaveLength(1);
  });
});

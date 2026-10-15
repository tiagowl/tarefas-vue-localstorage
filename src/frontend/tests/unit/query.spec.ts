import { describe, expect, it } from 'vitest';
import type { Task } from '@/domain/models';
import { calcTotalPages, filterTasks, paginate } from '@/domain/query';

const task = (id: string, title: string, status: Task['status']): Task => ({
  id,
  title,
  description: undefined,
  subtasks: [],
  status,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const tasks: Task[] = [
  task('1', 'Revisar proposta', 'todo'),
  task('2', 'Site institucional', 'doing'),
  task('3', 'Ler capítulo 4', 'done'),
  task('4', 'Relatório', 'doing'),
];

describe('filterTasks (US-11, US-12, US-13)', () => {
  it('filtra por nome de forma case-insensitive', () => {
    const result = filterTasks(tasks, { name: 'SITE', status: 'all' });
    expect(result.map((t) => t.id)).toEqual(['2']);
  });

  it('filtra por status', () => {
    const result = filterTasks(tasks, { name: '', status: 'doing' });
    expect(result.map((t) => t.id)).toEqual(['2', '4']);
  });

  it('combina nome e status com AND', () => {
    const result = filterTasks(tasks, { name: 'relatório', status: 'doing' });
    expect(result.map((t) => t.id)).toEqual(['4']);
  });

  it('retorna vazio quando nada corresponde', () => {
    expect(filterTasks(tasks, { name: 'zzz', status: 'all' })).toHaveLength(0);
  });
});

describe('paginate (US-14)', () => {
  it('retorna no máximo 8 itens por página', () => {
    const many = Array.from({ length: 10 }, (_, index) =>
      task(String(index), `T${index}`, 'todo'),
    );
    expect(paginate(many, 1, 8)).toHaveLength(8);
    expect(paginate(many, 2, 8)).toHaveLength(2);
  });

  it('calcula o total de páginas com última parcial', () => {
    expect(calcTotalPages(0, 8)).toBe(1);
    expect(calcTotalPages(8, 8)).toBe(1);
    expect(calcTotalPages(9, 8)).toBe(2);
    expect(calcTotalPages(17, 8)).toBe(3);
  });
});

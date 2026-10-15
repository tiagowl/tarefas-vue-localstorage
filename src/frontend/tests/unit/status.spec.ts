import { describe, expect, it } from 'vitest';
import type { Subtask } from '@/domain/models';
import { deriveStatus } from '@/domain/status';

const subtask = (done: boolean): Subtask => ({ id: 'x', title: 't', done });

describe('deriveStatus (US-10)', () => {
  it('sem subtarefas => todo', () => {
    expect(deriveStatus([])).toBe('todo');
  });

  it('substarefas existentes mas nenhuma feita => todo', () => {
    expect(deriveStatus([subtask(false), subtask(false)])).toBe('todo');
  });

  it('ao menos uma feita (e não todas) => doing', () => {
    expect(deriveStatus([subtask(true), subtask(false)])).toBe('doing');
  });

  it('todas as subtarefas feitas => done', () => {
    expect(deriveStatus([subtask(true), subtask(true)])).toBe('done');
  });

  it('uma única subtarefa feita => done', () => {
    expect(deriveStatus([subtask(true)])).toBe('done');
  });

  it('desmarcar após concluir volta de done para doing', () => {
    expect(deriveStatus([subtask(true), subtask(false)])).toBe('doing');
  });
});

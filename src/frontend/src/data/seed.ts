import { deriveStatus } from '@/domain/status';
import type { Subtask, Task } from '@/domain/models';
import type { TaskRepository } from './TaskRepository';

interface SeedSubtask {
  title: string;
  done: boolean;
}

interface SeedTask {
  title: string;
  description?: string;
  subtasks: SeedSubtask[];
  createdAt: string;
  updatedAt: string;
}

const SEED: SeedTask[] = [
  {
    title: 'Planejar a sprint do app',
    description: 'Definir o escopo da próxima entrega e o que fica de fora.',
    subtasks: [],
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
  },
  {
    title: 'Revisar proposta comercial',
    subtasks: [],
    createdAt: '2026-10-02T12:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z',
  },
  {
    title: 'Organizar o backlog',
    description: 'Agrupar pedidos soltos antes de estimar.',
    subtasks: [
      { title: 'Listar pedidos da semana', done: false },
      { title: 'Marcar duplicatas', done: false },
      { title: 'Priorizar com o time', done: false },
    ],
    createdAt: '2026-10-03T12:00:00.000Z',
    updatedAt: '2026-10-03T12:00:00.000Z',
  },
  {
    title: 'Migrar anotações antigas',
    description: 'Trazer o que ainda está em papel para o quadro.',
    subtasks: [
      { title: 'Fotografar as notas', done: false },
      { title: 'Digitar os títulos', done: false },
    ],
    createdAt: '2026-10-04T12:00:00.000Z',
    updatedAt: '2026-10-04T12:00:00.000Z',
  },
  {
    title: 'Implementar filtros da lista',
    description: 'Nome e status precisam funcionar juntos.',
    subtasks: [
      { title: 'Campo de busca', done: true },
      { title: 'Filtro por status', done: true },
      { title: 'Limpar filtros', done: false },
    ],
    createdAt: '2026-10-05T12:00:00.000Z',
    updatedAt: '2026-10-08T15:30:00.000Z',
  },
  {
    title: 'Ajustar o quadro Kanban',
    subtasks: [
      { title: 'Coluna A fazer', done: true },
      { title: 'Coluna Em progresso', done: false },
      { title: 'Coluna Feito', done: false },
    ],
    createdAt: '2026-10-06T12:00:00.000Z',
    updatedAt: '2026-10-09T11:00:00.000Z',
  },
  {
    title: 'Escrever cenários de status',
    description: 'Cobrir tarefa vazia, parcial e concluída.',
    subtasks: [
      { title: 'Caso sem subtarefas', done: true },
      { title: 'Caso parcial', done: false },
    ],
    createdAt: '2026-10-07T12:00:00.000Z',
    updatedAt: '2026-10-10T09:15:00.000Z',
  },
  {
    title: 'Preparar a demo para o cliente',
    description: 'Roteiro curto: criar, concluir uma subtarefa e filtrar.',
    subtasks: [
      { title: 'Montar o roteiro', done: true },
      { title: 'Ensaiar o fluxo', done: false },
      { title: 'Separar dados de exemplo', done: true },
    ],
    createdAt: '2026-10-08T12:00:00.000Z',
    updatedAt: '2026-10-12T18:00:00.000Z',
  },
  {
    title: 'Publicar a landing page',
    description: 'Página já revisada e no ar.',
    subtasks: [
      { title: 'Revisar textos', done: true },
      { title: 'Publicar', done: true },
    ],
    createdAt: '2026-09-20T12:00:00.000Z',
    updatedAt: '2026-09-28T16:45:00.000Z',
  },
  {
    title: 'Configurar a integração contínua',
    subtasks: [
      { title: 'Rodar testes no push', done: true },
      { title: 'Publicar o relatório', done: true },
      { title: 'Avisar no canal', done: true },
    ],
    createdAt: '2026-09-22T12:00:00.000Z',
    updatedAt: '2026-09-30T13:20:00.000Z',
  },
  {
    title: 'Documentar a arquitetura',
    subtasks: [{ title: 'Desenhar o fluxo de persistência', done: true }],
    createdAt: '2026-09-25T12:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    title: 'Fechar os bugs da release',
    description: 'Itens que bloqueavam a entrega de outubro.',
    subtasks: [
      { title: 'Corrigir paginação na última página', done: true },
      { title: 'Corrigir foco do modal', done: true },
    ],
    createdAt: '2026-09-18T12:00:00.000Z',
    updatedAt: '2026-10-11T17:40:00.000Z',
  },
];

function buildTask(spec: SeedTask, index: number): Task {
  const subtasks: Subtask[] = spec.subtasks.map((subtask, subIndex) => ({
    id: `seed-task-${index}-sub-${subIndex + 1}`,
    title: subtask.title,
    done: subtask.done,
  }));

  return {
    id: `seed-task-${index}`,
    title: spec.title,
    description: spec.description,
    subtasks,
    status: deriveStatus(subtasks),
    createdAt: spec.createdAt,
    updatedAt: spec.updatedAt,
  };
}

export function createSeedTasks(): Task[] {
  return SEED.map(buildTask);
}

function seedingAllowed(): boolean {
  if (!import.meta.env.DEV) return false;
  return typeof window === 'undefined' || window.__TAREFAS_DISABLE_SEED__ !== true;
}

/** Grava o conjunto de exemplo quando ainda não há tarefas. */
export function seedIfEmpty(repository: TaskRepository): void {
  if (!seedingAllowed()) return;
  if (repository.loadAll().length > 0) return;
  repository.saveAll(createSeedTasks());
}

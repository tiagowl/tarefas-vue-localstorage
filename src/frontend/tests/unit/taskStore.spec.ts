import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTaskStore } from '@/stores/taskStore';
import { InMemoryTaskRepository } from '@/data/InMemoryTaskRepository';

describe('taskStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('cria tarefa e persiste no repositório', () => {
    const repository = new InMemoryTaskRepository();
    const store = useTaskStore();
    store.init(repository);

    store.addTask('Nova tarefa', 'descrição');

    expect(store.tasks).toHaveLength(1);
    expect(store.tasks[0].status).toBe('todo');
    expect(repository.loadAll()).toHaveLength(1);
  });

  it('ignora tarefa com nome vazio', () => {
    const store = useTaskStore();
    store.init(new InMemoryTaskRepository());

    store.addTask('   ');

    expect(store.tasks).toHaveLength(0);
  });

  it('deriva o status conforme as subtarefas (US-10)', () => {
    const store = useTaskStore();
    store.init(new InMemoryTaskRepository());
    store.addTask('Tarefa');
    const taskId = store.tasks[0].id;

    store.addSubtask(taskId, 'a');
    store.addSubtask(taskId, 'b');
    expect(store.tasks[0].status).toBe('todo');

    store.toggleSubtask(taskId, store.tasks[0].subtasks[0].id);
    expect(store.tasks[0].status).toBe('doing');

    store.toggleSubtask(taskId, store.tasks[0].subtasks[1].id);
    expect(store.tasks[0].status).toBe('done');

    store.toggleSubtask(taskId, store.tasks[0].subtasks[0].id);
    expect(store.tasks[0].status).toBe('doing');
  });

  it('remove tarefa e suas subtarefas em cascata', () => {
    const store = useTaskStore();
    store.init(new InMemoryTaskRepository());
    store.addTask('Tarefa');
    const taskId = store.tasks[0].id;
    store.addSubtask(taskId, 'a');

    store.removeTask(taskId);

    expect(store.tasks).toHaveLength(0);
  });

  it('mantém o título anterior ao tentar renomear para vazio', () => {
    const store = useTaskStore();
    store.init(new InMemoryTaskRepository());
    store.addTask('Original');
    const taskId = store.tasks[0].id;

    store.updateTask(taskId, { title: '   ' });

    expect(store.tasks[0].title).toBe('Original');
  });

  it('conta tarefas por status', () => {
    const store = useTaskStore();
    store.init(new InMemoryTaskRepository());
    store.addTask('A');
    store.addTask('B');

    expect(store.statusCounts.todo).toBe(2);
    expect(store.statusCounts.doing).toBe(0);
    expect(store.statusCounts.done).toBe(0);
  });
});

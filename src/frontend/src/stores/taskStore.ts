import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { Status, Task, TaskDraft } from '@/domain/models';
import { deriveStatus } from '@/domain/status';
import { createId } from '@/domain/id';
import { isValidTitle, normalizeDescription, normalizeTitle } from '@/domain/validation';
import type { TaskRepository } from '@/data/TaskRepository';
import { LocalStorageTaskRepository } from '@/data/LocalStorageTaskRepository';
import { useToast } from '@/composables/useToast';

const now = (): string => new Date().toISOString();

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([]);
  let repository: TaskRepository = new LocalStorageTaskRepository();

  const { pushToast } = useToast();

  const statusCounts = computed<Record<Status, number>>(() => {
    const counts: Record<Status, number> = { todo: 0, doing: 0, done: 0 };
    for (const task of tasks.value) {
      counts[task.status] += 1;
    }
    return counts;
  });

  function init(taskRepository?: TaskRepository): void {
    if (taskRepository) repository = taskRepository;
    tasks.value = repository.loadAll();
  }

  function persist(): void {
    try {
      repository.saveAll(tasks.value);
    } catch {
      pushToast(
        'Não foi possível salvar no navegador. Verifique o espaço disponível.',
        'error',
      );
    }
  }

  function findTask(id: string): Task | undefined {
    return tasks.value.find((task) => task.id === id);
  }

  function recomputeStatus(task: Task): void {
    task.status = deriveStatus(task.subtasks);
    task.updatedAt = now();
  }

  function addTask(title: string, description?: string): void {
    if (!isValidTitle(title)) return;

    const timestamp = now();
    tasks.value.push({
      id: createId(),
      title: normalizeTitle(title),
      description: normalizeDescription(description ?? ''),
      subtasks: [],
      status: 'todo',
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    persist();
  }

  function updateTask(id: string, patch: Partial<Pick<Task, 'title' | 'description'>>): void {
    const task = findTask(id);
    if (!task) return;

    if (patch.title !== undefined) {
      if (!isValidTitle(patch.title)) return;
      task.title = normalizeTitle(patch.title);
    }

    if (patch.description !== undefined) {
      task.description = normalizeDescription(patch.description);
    }

    task.updatedAt = now();
    persist();
  }

  function removeTask(id: string): void {
    tasks.value = tasks.value.filter((task) => task.id !== id);
    persist();
  }

  function addSubtask(taskId: string, title: string): void {
    const task = findTask(taskId);
    if (!task || !isValidTitle(title)) return;

    task.subtasks.push({ id: createId(), title: normalizeTitle(title), done: false });
    recomputeStatus(task);
    persist();
  }

  function updateSubtask(taskId: string, subtaskId: string, title: string): void {
    const task = findTask(taskId);
    const subtask = task?.subtasks.find((item) => item.id === subtaskId);
    if (!task || !subtask || !isValidTitle(title)) return;

    subtask.title = normalizeTitle(title);
    task.updatedAt = now();
    persist();
  }

  function toggleSubtask(taskId: string, subtaskId: string): void {
    const task = findTask(taskId);
    const subtask = task?.subtasks.find((item) => item.id === subtaskId);
    if (!task || !subtask) return;

    subtask.done = !subtask.done;
    recomputeStatus(task);
    persist();
  }

  function removeSubtask(taskId: string, subtaskId: string): void {
    const task = findTask(taskId);
    if (!task) return;

    task.subtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId);
    recomputeStatus(task);
    persist();
  }

  function createTask(draft: TaskDraft): void {
    addTask(draft.title, draft.description);
  }

  return {
    tasks,
    statusCounts,
    init,
    findTask,
    addTask,
    createTask,
    updateTask,
    removeTask,
    addSubtask,
    updateSubtask,
    toggleSubtask,
    removeSubtask,
  };
});

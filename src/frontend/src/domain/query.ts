import type { Task, TaskFilters } from './models';

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const term = filters.name.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesName = term === '' || task.title.toLowerCase().includes(term);
    const matchesStatus = filters.status === 'all' || task.status === filters.status;

    return matchesName && matchesStatus;
  });
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  if (pageSize <= 0) return [];
  const safePage = Math.max(1, Math.floor(page));
  const start = (safePage - 1) * pageSize;

  return items.slice(start, start + pageSize);
}

export function calcTotalPages(totalItems: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

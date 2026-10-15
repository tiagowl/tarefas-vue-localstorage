import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { PAGE_SIZE } from '@/config/env';
import type { TaskFilters, ViewMode } from '@/domain/models';
import { calcTotalPages, filterTasks, paginate } from '@/domain/query';
import { loadActiveView, saveActiveView } from '@/data/preferences';
import { useTaskStore } from './taskStore';

export const useUiStore = defineStore('ui', () => {
  const taskStore = useTaskStore();

  const activeView = ref<ViewMode>(loadActiveView());
  const filters = ref<TaskFilters>({ name: '', status: 'all' });
  const page = ref(1);

  const filtered = computed(() => filterTasks(taskStore.tasks, filters.value));
  const totalResults = computed(() => filtered.value.length);
  const totalPages = computed(() => calcTotalPages(totalResults.value, PAGE_SIZE));
  const paged = computed(() => paginate(filtered.value, page.value, PAGE_SIZE));
  const hasActiveFilters = computed(
    () => filters.value.name.trim() !== '' || filters.value.status !== 'all',
  );

  watch(activeView, (view) => saveActiveView(view));

  watch(totalPages, (pages) => {
    if (page.value > pages) page.value = pages;
  });

  function setFilter(patch: Partial<TaskFilters>): void {
    filters.value = { ...filters.value, ...patch };
    page.value = 1;
  }

  function resetFilters(): void {
    filters.value = { name: '', status: 'all' };
    page.value = 1;
  }

  function setView(view: ViewMode): void {
    activeView.value = view;
  }

  function next(): void {
    if (page.value < totalPages.value) page.value += 1;
  }

  function prev(): void {
    if (page.value > 1) page.value -= 1;
  }

  return {
    activeView,
    filters,
    page,
    filtered,
    paged,
    totalResults,
    totalPages,
    hasActiveFilters,
    setFilter,
    resetFilters,
    setView,
    next,
    prev,
  };
});

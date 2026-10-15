<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { StatusFilterValue, TaskFilters } from '@/domain/models';
import { SEARCH_DEBOUNCE_MS } from '@/config/env';
import { useDebounce } from '@/composables/useDebounce';
import SearchInput from './SearchInput.vue';
import StatusFilter from './StatusFilter.vue';

const props = defineProps<{ filters: TaskFilters }>();

const emit = defineEmits<{ 'update:filters': [patch: Partial<TaskFilters>] }>();

const STATUS_LABELS: Record<StatusFilterValue, string> = {
  all: 'Todos',
  todo: 'A fazer',
  doing: 'Fazendo',
  done: 'Feito',
};

const search = ref(props.filters.name);
const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

watch(debouncedSearch, (value) => {
  if (value !== props.filters.name) emit('update:filters', { name: value });
});

watch(
  () => props.filters.name,
  (value) => {
    if (value !== search.value) search.value = value;
  },
);

const statusModel = computed<StatusFilterValue>({
  get: () => props.filters.status,
  set: (value) => emit('update:filters', { status: value }),
});

const hasActive = computed(
  () => props.filters.name.trim() !== '' || props.filters.status !== 'all',
);

function clearFilters(): void {
  search.value = '';
  emit('update:filters', { name: '', status: 'all' });
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <SearchInput v-model="search" />
      <StatusFilter v-model="statusModel" />
      <button
        v-if="hasActive"
        type="button"
        class="inline-flex h-10 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium text-text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @click="clearFilters"
      >
        Limpar
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <div v-if="hasActive" class="flex flex-wrap items-center gap-2">
      <span
        v-if="filters.name.trim()"
        class="inline-flex items-center gap-1 rounded-sm bg-bg px-2 py-1 text-xs text-text-muted"
      >
        Nome: “{{ filters.name }}”
      </span>
      <span
        v-if="filters.status !== 'all'"
        class="inline-flex items-center gap-1 rounded-sm bg-bg px-2 py-1 text-xs text-text-muted"
      >
        Status: {{ STATUS_LABELS[filters.status] }}
      </span>
    </div>
  </div>
</template>

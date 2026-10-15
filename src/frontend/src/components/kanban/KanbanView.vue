<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { Task } from '@/domain/models';
import { useTaskStore } from '@/stores/taskStore';
import { useUiStore } from '@/stores/uiStore';
import KanbanColumn from './KanbanColumn.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const emit = defineEmits<{
  create: [];
  open: [task: Task];
  edit: [task: Task];
  delete: [task: Task];
}>();

const taskStore = useTaskStore();
const uiStore = useUiStore();
const { filtered } = storeToRefs(uiStore);

const hasNoTasks = computed(() => taskStore.tasks.length === 0);
const term = computed(() => uiStore.filters.name.trim());

const columns = computed(() => [
  { status: 'todo' as const, title: 'A fazer', tasks: filtered.value.filter((t) => t.status === 'todo') },
  { status: 'doing' as const, title: 'Fazendo', tasks: filtered.value.filter((t) => t.status === 'doing') },
  { status: 'done' as const, title: 'Feito', tasks: filtered.value.filter((t) => t.status === 'done') },
]);
</script>

<template>
  <EmptyState
    v-if="hasNoTasks"
    title="Você ainda não tem tarefas"
    description="Crie a primeira e comece a organizar seu dia."
    cta-label="Criar primeira tarefa"
    @action="emit('create')"
  />

  <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <KanbanColumn
      v-for="column in columns"
      :key="column.status"
      :title="column.title"
      :status="column.status"
      :tasks="column.tasks"
      @open="emit('open', $event)"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />

    <p v-if="term" class="col-span-full text-center text-xs text-text-muted">
      Filtros ativos também se aplicam à visão Kanban.
    </p>
  </div>
</template>

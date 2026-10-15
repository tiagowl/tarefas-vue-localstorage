<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { Task } from '@/domain/models';
import { useTaskStore } from '@/stores/taskStore';
import { useUiStore } from '@/stores/uiStore';
import TaskCard from '@/components/task/TaskCard.vue';
import Pagination from './Pagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';

const emit = defineEmits<{
  create: [];
  open: [task: Task];
  edit: [task: Task];
  delete: [task: Task];
}>();

const taskStore = useTaskStore();
const uiStore = useUiStore();
const { paged, page, totalPages, totalResults } = storeToRefs(uiStore);

const hasNoTasks = computed(() => taskStore.tasks.length === 0);
const term = computed(() => uiStore.filters.name.trim());
</script>

<template>
  <div class="flex flex-col gap-6">
    <EmptyState
      v-if="hasNoTasks"
      title="Você ainda não tem tarefas"
      description="Crie a primeira e comece a organizar seu dia."
      cta-label="Criar primeira tarefa"
      @action="emit('create')"
    />

    <EmptyState
      v-else-if="totalResults === 0"
      icon="search"
      :title="term ? `Nenhuma tarefa encontrada para “${term}”` : 'Nenhuma tarefa encontrada'"
      description="Ajuste ou limpe os filtros para ver outras tarefas."
      cta-label="Limpar filtros"
      @action="uiStore.resetFilters()"
    />

    <template v-else>
      <ul class="flex flex-col gap-3">
        <li v-for="task in paged" :key="task.id">
          <TaskCard
            :task="task"
            @open="emit('open', $event)"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </li>
      </ul>

      <Pagination
        v-if="totalPages > 1"
        :page="page"
        :total-pages="totalPages"
        @prev="uiStore.prev()"
        @next="uiStore.next()"
      />
    </template>
  </div>
</template>

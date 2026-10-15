<script setup lang="ts">
import type { Status, Task } from '@/domain/models';
import TaskCard from '@/components/task/TaskCard.vue';

defineProps<{
  title: string;
  status: Status;
  tasks: Task[];
}>();

const emit = defineEmits<{
  open: [task: Task];
  edit: [task: Task];
  delete: [task: Task];
}>();

const ACCENT: Record<Status, string> = {
  todo: 'bg-status-todo',
  doing: 'bg-status-doing',
  done: 'bg-status-done',
};
</script>

<template>
  <section class="flex min-w-0 flex-col gap-3">
    <header class="flex items-center gap-2">
      <span class="h-2.5 w-2.5 rounded-full" :class="ACCENT[status]" aria-hidden="true"></span>
      <h2 class="text-h2 font-semibold text-text">{{ title }}</h2>
      <span
        class="rounded-sm bg-bg px-2 py-0.5 text-xs font-medium text-text-muted"
        :aria-label="`${tasks.length} tarefas`"
      >
        ({{ tasks.length }})
      </span>
    </header>

    <ul v-if="tasks.length > 0" class="flex flex-col gap-3">
      <li v-for="task in tasks" :key="task.id">
        <TaskCard
          :task="task"
          @open="emit('open', $event)"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </li>
    </ul>

    <p
      v-else
      class="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted"
    >
      Nenhuma tarefa aqui
    </p>
  </section>
</template>

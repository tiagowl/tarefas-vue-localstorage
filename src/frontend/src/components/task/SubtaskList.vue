<script setup lang="ts">
import { ref } from 'vue';
import type { Subtask } from '@/domain/models';
import AppIcon from '@/components/common/AppIcon.vue';
import SubtaskItem from './SubtaskItem.vue';

defineProps<{ subtasks: Subtask[] }>();

const emit = defineEmits<{
  toggle: [id: string];
  add: [title: string];
  rename: [id: string, title: string];
  remove: [id: string];
}>();

const newTitle = ref('');
const error = ref('');

function addSubtask(): void {
  const value = newTitle.value.trim();
  if (value === '') {
    error.value = 'Informe o nome da subtarefa.';
    return;
  }
  error.value = '';
  emit('add', value);
  newTitle.value = '';
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p v-if="subtasks.length === 0" class="rounded-md border border-dashed border-border px-3 py-4 text-center text-sm text-text-muted">
      Nenhuma subtarefa ainda — adicione a primeira.
    </p>

    <ul v-else class="flex flex-col divide-y divide-border rounded-md border border-border">
      <SubtaskItem
        v-for="subtask in subtasks"
        :key="subtask.id"
        :subtask="subtask"
        @toggle="emit('toggle', subtask.id)"
        @rename="emit('rename', subtask.id, $event)"
        @remove="emit('remove', subtask.id)"
      />
    </ul>

    <form class="flex flex-col gap-1" @submit.prevent="addSubtask">
      <label for="new-subtask" class="sr-only">Nova subtarefa</label>
      <div class="flex gap-2">
        <input
          id="new-subtask"
          v-model="newTitle"
          type="text"
          placeholder="Nova subtarefa…"
          class="min-w-0 flex-1 rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :aria-invalid="error ? 'true' : 'false'"
          aria-describedby="new-subtask-error"
          @input="error = ''"
        />
        <button
          type="submit"
          class="inline-flex h-10 shrink-0 items-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <AppIcon name="plus" class="h-4 w-4" />
          Adicionar
        </button>
      </div>
      <p v-if="error" id="new-subtask-error" class="text-xs text-danger" role="alert">{{ error }}</p>
    </form>
  </div>
</template>

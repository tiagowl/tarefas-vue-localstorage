<script setup lang="ts">
import { computed } from 'vue';
import type { Task, TaskDraft } from '@/domain/models';
import BaseModal from '@/components/common/BaseModal.vue';
import TaskForm from './TaskForm.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    mode: 'create' | 'edit';
    task?: Task | null;
  }>(),
  {
    task: null,
  },
);

const emit = defineEmits<{
  submit: [draft: TaskDraft];
  cancel: [];
}>();

const heading = computed(() => (props.mode === 'create' ? 'Nova tarefa' : 'Editar tarefa'));
const submitLabel = computed(() => (props.mode === 'create' ? 'Criar' : 'Salvar'));
</script>

<template>
  <BaseModal
    :open="open"
    :title="heading"
    initial-focus-selector="input"
    @close="emit('cancel')"
  >
    <TaskForm
      :initial-title="task?.title ?? ''"
      :initial-description="task?.description ?? ''"
      :submit-label="submitLabel"
      @submit="emit('submit', $event)"
      @cancel="emit('cancel')"
    />
  </BaseModal>
</template>

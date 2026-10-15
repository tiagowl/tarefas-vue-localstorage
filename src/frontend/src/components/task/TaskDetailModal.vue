<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/domain/models';
import { useTaskStore } from '@/stores/taskStore';
import { useToast } from '@/composables/useToast';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import StatusBadge from '@/components/status/StatusBadge.vue';
import ProgressBar from '@/components/status/ProgressBar.vue';
import SubtaskList from './SubtaskList.vue';

const props = defineProps<{
  open: boolean;
  taskId: string | null;
}>();

const emit = defineEmits<{
  close: [];
  edit: [task: Task];
  delete: [task: Task];
}>();

const taskStore = useTaskStore();
const { pushToast } = useToast();

const task = computed(() => (props.taskId ? taskStore.findTask(props.taskId) ?? null : null));
const doneCount = computed(() => task.value?.subtasks.filter((subtask) => subtask.done).length ?? 0);
const subtaskCount = computed(() => task.value?.subtasks.length ?? 0);

function onAdd(title: string): void {
  if (task.value) taskStore.addSubtask(task.value.id, title);
}

function onToggle(id: string): void {
  if (!task.value) return;
  taskStore.toggleSubtask(task.value.id, id);
  if (task.value.status === 'done') pushToast('Tarefa concluída', 'success');
}

function onRename(id: string, title: string): void {
  if (task.value) taskStore.updateSubtask(task.value.id, id, title);
}

function onRemove(id: string): void {
  if (task.value) taskStore.removeSubtask(task.value.id, id);
}
</script>

<template>
  <BaseModal
    :open="open && task !== null"
    :title="task?.title ?? ''"
    @close="emit('close')"
  >
    <template v-if="task">
      <div class="flex flex-wrap items-center gap-3">
        <StatusBadge :status="task.status" />
        <ProgressBar :done="doneCount" :total="subtaskCount" />
      </div>

      <p
        v-if="task.description"
        class="mt-3 whitespace-pre-line break-words text-sm text-text-muted"
      >
        {{ task.description }}
      </p>

      <section class="mt-6">
        <h3 class="mb-2 text-sm font-semibold text-text">Subtarefas</h3>
        <SubtaskList
          :subtasks="task.subtasks"
          @toggle="onToggle"
          @add="onAdd"
          @rename="onRename"
          @remove="onRemove"
        />
      </section>

      <footer class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <BaseButton variant="secondary" @click="emit('edit', task)">Editar tarefa</BaseButton>
        <BaseButton variant="danger" @click="emit('delete', task)">Excluir</BaseButton>
      </footer>
    </template>
  </BaseModal>
</template>

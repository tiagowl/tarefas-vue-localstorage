<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { Task, TaskDraft } from '@/domain/models';
import { useTaskStore } from '@/stores/taskStore';
import { useUiStore } from '@/stores/uiStore';
import { useToast } from '@/composables/useToast';

import AppHeader from '@/components/layout/AppHeader.vue';
import FilterBar from '@/components/filters/FilterBar.vue';
import TaskListView from '@/components/list/TaskListView.vue';
import KanbanView from '@/components/kanban/KanbanView.vue';
import TaskFormModal from '@/components/task/TaskFormModal.vue';
import TaskDetailModal from '@/components/task/TaskDetailModal.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import ToastHost from '@/components/common/ToastHost.vue';

const taskStore = useTaskStore();
const uiStore = useUiStore();
const { pushToast } = useToast();

const { activeView, filters } = storeToRefs(uiStore);

const formOpen = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const editingTask = ref<Task | null>(null);

const detailOpen = ref(false);
const detailTaskId = ref<string | null>(null);

const confirmOpen = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
let pendingAction: (() => void) | null = null;

const hasTasks = computed(() => taskStore.tasks.length > 0);

function setView(view: 'list' | 'kanban'): void {
  uiStore.setView(view);
}

function openCreate(): void {
  formMode.value = 'create';
  editingTask.value = null;
  formOpen.value = true;
}

function openEdit(task: Task): void {
  detailOpen.value = false;
  formMode.value = 'edit';
  editingTask.value = task;
  formOpen.value = true;
}

function closeForm(): void {
  formOpen.value = false;
  editingTask.value = null;
}

function onFormSubmit(draft: TaskDraft): void {
  if (formMode.value === 'create') {
    taskStore.addTask(draft.title, draft.description);
    pushToast('Tarefa criada', 'success');
  } else if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, {
      title: draft.title,
      description: draft.description,
    });
    pushToast('Tarefa atualizada', 'success');
  }

  closeForm();
}

function openDetail(task: Task): void {
  detailTaskId.value = task.id;
  detailOpen.value = true;
}

function closeDetail(): void {
  detailOpen.value = false;
  detailTaskId.value = null;
}

function requestDelete(task: Task): void {
  const subtaskCount = task.subtasks.length;
  confirmTitle.value = 'Excluir tarefa?';
  confirmMessage.value =
    subtaskCount > 0
      ? `“${task.title}” e suas ${subtaskCount} subtarefa(s) serão removidas. Esta ação não pode ser desfeita.`
      : `“${task.title}” será removida. Esta ação não pode ser desfeita.`;
  pendingAction = () => {
    taskStore.removeTask(task.id);
    pushToast('Tarefa excluída', 'success');
  };
  closeDetail();
  confirmOpen.value = true;
}

function onConfirm(): void {
  pendingAction?.();
  pendingAction = null;
  confirmOpen.value = false;
}

function onCancelConfirm(): void {
  pendingAction = null;
  confirmOpen.value = false;
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader :active-view="activeView" @update:active-view="setView" @create="openCreate" />

    <main class="mx-auto w-full max-w-[1120px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div v-if="hasTasks" class="mb-6">
        <FilterBar :filters="filters" @update:filters="uiStore.setFilter($event)" />
      </div>

      <TaskListView
        v-if="activeView === 'list'"
        @create="openCreate"
        @open="openDetail"
        @edit="openEdit"
        @delete="requestDelete"
      />
      <KanbanView
        v-else
        @create="openCreate"
        @open="openDetail"
        @edit="openEdit"
        @delete="requestDelete"
      />
    </main>

    <footer class="mx-auto w-full max-w-[1120px] px-4 pb-6 text-center text-xs text-text-muted sm:px-6 lg:px-8">
      Seus dados ficam salvos neste navegador. Limpar o cache pode removê-los.
    </footer>

    <TaskFormModal
      :open="formOpen"
      :mode="formMode"
      :task="editingTask"
      @submit="onFormSubmit"
      @cancel="closeForm"
    />

    <TaskDetailModal
      :open="detailOpen"
      :task-id="detailTaskId"
      @close="closeDetail"
      @edit="openEdit"
      @delete="requestDelete"
    />

    <ConfirmDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="onConfirm"
      @cancel="onCancelConfirm"
    />

    <ToastHost />
  </div>
</template>

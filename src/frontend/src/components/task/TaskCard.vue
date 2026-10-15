<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Task } from '@/domain/models';
import AppIcon from '@/components/common/AppIcon.vue';
import StatusBadge from '@/components/status/StatusBadge.vue';
import ProgressBar from '@/components/status/ProgressBar.vue';

const props = defineProps<{ task: Task }>();

const emit = defineEmits<{
  open: [task: Task];
  edit: [task: Task];
  delete: [task: Task];
}>();

const root = ref<HTMLElement | null>(null);
const menuOpen = ref(false);

const doneCount = computed(() => props.task.subtasks.filter((subtask) => subtask.done).length);
const totalCount = computed(() => props.task.subtasks.length);

function openDetail(): void {
  emit('open', props.task);
}

function onCardKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openDetail();
  }
}

function toggleMenu(): void {
  menuOpen.value = !menuOpen.value;
}

function closeMenu(): void {
  menuOpen.value = false;
}

function handleFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget as Node | null;
  if (!root.value?.contains(next)) closeMenu();
}

function edit(): void {
  closeMenu();
  emit('edit', props.task);
}

function remove(): void {
  closeMenu();
  emit('delete', props.task);
}
</script>

<template>
  <article
    ref="root"
    class="relative flex items-start gap-2 rounded-md border border-border bg-surface p-4 shadow-sm transition hover:shadow-md"
    @focusout="handleFocusOut"
  >
    <div
      class="min-w-0 flex-1 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      role="button"
      tabindex="0"
      :aria-label="`Abrir detalhes de ${task.title}`"
      @click="openDetail"
      @keydown="onCardKeydown"
    >
      <div class="flex items-start justify-between gap-3">
        <h3 class="min-w-0 flex-1 break-words text-body font-semibold text-text">
          {{ task.title }}
        </h3>
        <StatusBadge :status="task.status" />
      </div>

      <p v-if="task.description" class="mt-2 line-clamp-2 break-words text-sm text-text-muted">
        {{ task.description }}
      </p>

      <div class="mt-3">
        <ProgressBar :done="doneCount" :total="totalCount" />
      </div>
    </div>

    <div class="relative shrink-0">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-sm text-text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :aria-label="`Ações de ${task.title}`"
        aria-haspopup="menu"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        @click="toggleMenu"
      >
        <AppIcon name="dots" class="h-5 w-5" />
      </button>

      <div
        v-if="menuOpen"
        role="menu"
        class="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-md"
      >
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text transition hover:bg-bg focus-visible:outline-none focus-visible:bg-bg"
          @click="edit"
        >
          <AppIcon name="edit" class="h-4 w-4" />
          Editar
        </button>
        <button
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger transition hover:bg-danger/10 focus-visible:outline-none focus-visible:bg-danger/10"
          @click="remove"
        >
          <AppIcon name="trash" class="h-4 w-4" />
          Excluir
        </button>
      </div>
    </div>
  </article>
</template>

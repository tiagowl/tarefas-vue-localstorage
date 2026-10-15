<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { Subtask } from '@/domain/models';
import AppIcon from '@/components/common/AppIcon.vue';

const props = defineProps<{ subtask: Subtask }>();

const emit = defineEmits<{
  toggle: [];
  rename: [title: string];
  remove: [];
}>();

const editing = ref(false);
const confirming = ref(false);
const draft = ref(props.subtask.title);
const inputRef = ref<HTMLInputElement | null>(null);

async function startEdit(): Promise<void> {
  editing.value = true;
  draft.value = props.subtask.title;
  await nextTick();
  inputRef.value?.focus();
  inputRef.value?.select();
}

function saveEdit(): void {
  const value = draft.value.trim();
  if (value !== '' && value !== props.subtask.title) {
    emit('rename', value);
  }
  editing.value = false;
}

function cancelEdit(): void {
  editing.value = false;
  draft.value = props.subtask.title;
}
</script>

<template>
  <li class="flex items-center gap-3 rounded-sm px-2 py-2 transition hover:bg-bg">
    <input
      :id="`subtask-${subtask.id}`"
      type="checkbox"
      class="h-5 w-5 shrink-0 cursor-pointer rounded-sm border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :checked="subtask.done"
      @change="emit('toggle')"
    />

    <template v-if="editing">
      <label :for="`subtask-${subtask.id}`" class="sr-only">Subtarefa</label>
      <input
        ref="inputRef"
        v-model="draft"
        type="text"
        class="min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 py-1 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        @keydown.enter.prevent="saveEdit"
        @keydown.esc="cancelEdit"
        @blur="saveEdit"
      />
    </template>

    <label
      v-else
      :for="`subtask-${subtask.id}`"
      class="min-w-0 flex-1 cursor-pointer break-words text-sm"
      :class="subtask.done ? 'text-text-muted line-through' : 'text-text'"
    >
      {{ subtask.title }}
    </label>

    <div v-if="!editing" class="flex shrink-0 items-center gap-1">
      <template v-if="confirming">
        <button
          type="button"
          class="rounded-sm px-2 py-1 text-xs font-medium text-danger transition hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          @click="emit('remove')"
        >
          Excluir
        </button>
        <button
          type="button"
          class="rounded-sm px-2 py-1 text-xs text-text-muted transition hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          @click="confirming = false"
        >
          Cancelar
        </button>
      </template>

      <template v-else>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-sm text-text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :aria-label="`Editar subtarefa ${subtask.title}`"
          @click="startEdit"
        >
          <AppIcon name="edit" class="h-4 w-4" />
        </button>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-sm text-text-muted transition hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :aria-label="`Excluir subtarefa ${subtask.title}`"
          @click="confirming = true"
        >
          <AppIcon name="trash" class="h-4 w-4" />
        </button>
      </template>
    </div>
  </li>
</template>

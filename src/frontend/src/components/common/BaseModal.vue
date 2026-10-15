<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import AppIcon from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    initialFocusSelector?: string;
  }>(),
  {
    initialFocusSelector: '',
  },
);

const emit = defineEmits<{ close: [] }>();

const dialogRef = ref<HTMLElement | null>(null);
const titleId = `modal-title-${Math.random().toString(36).slice(2)}`;
let lastFocused: HTMLElement | null = null;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(): HTMLElement[] {
  if (!dialogRef.value) return [];
  return Array.from(dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

function focusInitial(): void {
  if (!dialogRef.value) return;
  const preferred = props.initialFocusSelector
    ? dialogRef.value.querySelector<HTMLElement>(props.initialFocusSelector)
    : null;
  const target = preferred ?? getFocusable()[0] ?? dialogRef.value;
  target.focus();
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    emit('close');
    return;
  }

  if (event.key !== 'Tab') return;

  const items = getFocusable();
  if (items.length === 0) return;

  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement | null;
      await nextTick();
      focusInitial();
    } else {
      lastFocused?.focus?.();
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      @keydown="onKeydown"
    >
      <div
        class="absolute inset-0 bg-slate-900/50"
        aria-hidden="true"
        @click="emit('close')"
      ></div>

      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        class="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-lg bg-surface shadow-lg focus:outline-none sm:rounded-lg"
      >
        <header class="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <h2 :id="titleId" class="text-h2 font-semibold text-text break-words">{{ title }}</h2>
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Fechar"
            @click="emit('close')"
          >
            <AppIcon name="close" class="h-5 w-5" />
          </button>
        </header>

        <div class="overflow-y-auto px-6 py-5">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          class="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

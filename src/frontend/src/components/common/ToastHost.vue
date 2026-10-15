<script setup lang="ts">
import { useToast, type ToastVariant } from '@/composables/useToast';

const { toasts, dismissToast } = useToast();

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: 'border-status-done/40 bg-status-done/10 text-status-done',
  error: 'border-danger/40 bg-danger/10 text-danger',
  info: 'border-border bg-surface text-text',
};
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-auto sm:items-end"
    aria-live="polite"
    aria-atomic="false"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="status"
        class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-md"
        :class="VARIANT_CLASSES[toast.variant]"
      >
        <span class="flex-1">{{ toast.message }}</span>
        <button
          type="button"
          class="shrink-0 text-xs opacity-70 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Fechar aviso"
          @click="dismissToast(toast.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  animation: toast-in 200ms ease-out;
}

.toast-leave-active {
  transition: opacity 150ms ease-in;
}

.toast-leave-to {
  opacity: 0;
}
</style>

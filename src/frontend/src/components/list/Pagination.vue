<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from '@/components/common/AppIcon.vue';

const props = defineProps<{
  page: number;
  totalPages: number;
}>();

const emit = defineEmits<{ prev: []; next: [] }>();

const canPrev = computed(() => props.page > 1);
const canNext = computed(() => props.page < props.totalPages);

const BUTTON_CLASSES =
  'inline-flex h-10 items-center gap-1 rounded-md border border-border bg-surface px-3 text-sm font-medium text-text transition hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
</script>

<template>
  <nav class="flex items-center justify-center gap-4" aria-label="Paginação">
    <button
      type="button"
      :class="BUTTON_CLASSES"
      :disabled="!canPrev"
      @click="emit('prev')"
    >
      <AppIcon name="chevron-left" class="h-4 w-4" />
      Anterior
    </button>

    <span class="text-sm text-text-muted" aria-live="polite">
      Página {{ page }} de {{ totalPages }}
    </span>

    <button
      type="button"
      :class="BUTTON_CLASSES"
      :disabled="!canNext"
      @click="emit('next')"
    >
      Próxima
      <AppIcon name="chevron-right" class="h-4 w-4" />
    </button>
  </nav>
</template>

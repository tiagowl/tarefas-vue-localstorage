<script setup lang="ts">
import type { ViewMode } from '@/domain/models';
import { APP_TITLE } from '@/config/env';
import AppIcon from '@/components/common/AppIcon.vue';

defineProps<{ activeView: ViewMode }>();

const emit = defineEmits<{
  'update:activeView': [view: ViewMode];
  create: [];
}>();

const VIEWS: { value: ViewMode; label: string; icon: 'list' | 'kanban' }[] = [
  { value: 'list', label: 'Lista', icon: 'list' },
  { value: 'kanban', label: 'Kanban', icon: 'kanban' },
];
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
    <div class="mx-auto flex w-full max-w-[1120px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <h1 class="flex items-center gap-2 text-display text-text">
        <span class="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white" aria-hidden="true">
          <AppIcon name="check" class="h-5 w-5" />
        </span>
        {{ APP_TITLE }}
      </h1>

      <div class="flex items-center justify-between gap-3 sm:justify-end">
        <div
          role="group"
          aria-label="Selecionar visualização"
          class="flex items-center rounded-md border border-border bg-bg p-0.5"
        >
          <button
            v-for="view in VIEWS"
            :key="view.value"
            type="button"
            class="inline-flex h-8 items-center gap-1 rounded-sm px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            :class="
              activeView === view.value
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text'
            "
            :aria-pressed="activeView === view.value ? 'true' : 'false'"
            @click="emit('update:activeView', view.value)"
          >
            <AppIcon :name="view.icon" class="h-4 w-4" />
            {{ view.label }}
          </button>
        </div>

        <button
          type="button"
          class="inline-flex h-10 items-center gap-1 rounded-md bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          @click="emit('create')"
        >
          <AppIcon name="plus" class="h-4 w-4" />
          <span class="hidden sm:inline">Nova tarefa</span>
          <span class="sm:hidden">Nova</span>
        </button>
      </div>
    </div>
  </header>
</template>

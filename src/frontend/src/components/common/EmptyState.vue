<script setup lang="ts">
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    ctaLabel?: string;
    icon?: 'inbox' | 'search';
  }>(),
  {
    description: '',
    ctaLabel: '',
    icon: 'inbox',
  },
);

const emit = defineEmits<{ action: [] }>();

const hasAction = computed(() => props.ctaLabel.trim() !== '');
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-border bg-surface px-6 py-12 text-center">
    <span class="text-text-muted"><AppIcon :name="icon" class="h-10 w-10" /></span>
    <div class="flex flex-col gap-1">
      <h2 class="text-h2 font-semibold text-text">{{ title }}</h2>
      <p v-if="description" class="text-sm text-text-muted">{{ description }}</p>
    </div>
    <button
      v-if="hasAction"
      type="button"
      class="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      @click="emit('action')"
    >
      <AppIcon name="plus" class="h-4 w-4" />
      {{ ctaLabel }}
    </button>
  </div>
</template>

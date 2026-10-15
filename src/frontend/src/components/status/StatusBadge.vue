<script setup lang="ts">
import { computed } from 'vue';
import type { Status } from '@/domain/models';

const props = defineProps<{ status: Status }>();

const CONFIG: Record<Status, { label: string; icon: string; classes: string }> = {
  todo: { label: 'A fazer', icon: '○', classes: 'bg-status-todo/10 text-status-todo' },
  doing: { label: 'Fazendo', icon: '◐', classes: 'bg-status-doing/10 text-status-doing' },
  done: { label: 'Feito', icon: '✓', classes: 'bg-status-done/10 text-status-done' },
};

const config = computed(() => CONFIG[props.status]);
</script>

<template>
  <span
    class="inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-medium"
    :class="config.classes"
    :aria-label="`Status: ${config.label}`"
  >
    <span aria-hidden="true">{{ config.icon }}</span>
    <span>{{ config.label }}</span>
  </span>
</template>

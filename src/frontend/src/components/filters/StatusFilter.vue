<script setup lang="ts">
import type { StatusFilterValue } from '@/domain/models';

withDefaults(
  defineProps<{
    modelValue: StatusFilterValue;
    id?: string;
  }>(),
  {
    id: 'status-filter',
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: StatusFilterValue] }>();

const OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'todo', label: 'A fazer' },
  { value: 'doing', label: 'Fazendo' },
  { value: 'done', label: 'Feito' },
];

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value as StatusFilterValue);
}
</script>

<template>
  <div class="flex items-center gap-2">
    <label :for="id" class="whitespace-nowrap text-sm text-text-muted">Status:</label>
    <select
      :id="id"
      :value="modelValue"
      class="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      @change="onChange"
    >
      <option v-for="option in OPTIONS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

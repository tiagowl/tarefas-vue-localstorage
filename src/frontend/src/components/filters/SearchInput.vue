<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue';

withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    label?: string;
    id?: string;
  }>(),
  {
    placeholder: 'Buscar por nome…',
    label: 'Buscar por nome',
    id: 'search-input',
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="relative min-w-0 flex-1">
    <label :for="id" class="sr-only">{{ label }}</label>
    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
      <AppIcon name="search" class="h-4 w-4" />
    </span>
    <input
      :id="id"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      class="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-9 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      @input="onInput"
    />
    <button
      v-if="modelValue"
      type="button"
      class="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm text-text-muted transition hover:bg-bg hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Limpar busca"
      @click="emit('update:modelValue', '')"
    >
      <AppIcon name="close" class="h-4 w-4" />
    </button>
  </div>
</template>

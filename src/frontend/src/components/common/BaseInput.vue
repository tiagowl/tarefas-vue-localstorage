<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    label: string;
    id?: string;
    placeholder?: string;
    type?: string;
    error?: string;
    required?: boolean;
    autofocus?: boolean;
    rows?: number;
  }>(),
  {
    id: undefined,
    placeholder: '',
    type: 'text',
    error: '',
    required: false,
    autofocus: false,
    rows: 0,
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const inputId = computed(() => props.id ?? `field-${Math.random().toString(36).slice(2)}`);
const errorId = computed(() => `${inputId.value}-error`);
const hasError = computed(() => props.error.trim() !== '');
const describedBy = computed(() => (hasError.value ? errorId.value : undefined));

const FIELD_CLASSES =
  'w-full rounded-sm border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="inputId" class="text-sm font-medium text-text">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
    </label>

    <textarea
      v-if="rows > 0"
      :id="inputId"
      :value="modelValue"
      :rows="rows"
      :placeholder="placeholder"
      :aria-invalid="hasError ? 'true' : 'false'"
      :aria-describedby="describedBy"
      :class="[FIELD_CLASSES, hasError ? 'border-danger' : 'border-border']"
      @input="onInput"
    ></textarea>

    <input
      v-else
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :aria-invalid="hasError ? 'true' : 'false'"
      :aria-describedby="describedBy"
      :class="[FIELD_CLASSES, hasError ? 'border-danger' : 'border-border']"
      @input="onInput"
    />

    <p v-if="hasError" :id="errorId" class="flex items-center gap-1 text-xs text-danger" role="alert">
      <span aria-hidden="true">⚠</span>
      {{ error }}
    </p>
  </div>
</template>

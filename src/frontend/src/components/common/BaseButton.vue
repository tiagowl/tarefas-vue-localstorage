<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'icon';
type ButtonType = 'button' | 'submit' | 'reset';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: ButtonType;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    block: false,
  },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  icon: 'h-8 w-8',
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-border bg-surface text-text hover:bg-bg',
  danger: 'bg-danger text-white hover:opacity-90',
  ghost: 'text-text-muted hover:bg-bg hover:text-text',
};

const classes = computed(() => [
  BASE,
  SIZES[props.size],
  VARIANTS[props.variant],
  props.block ? 'w-full' : '',
]);

function onClick(event: MouseEvent): void {
  if (props.disabled || props.loading) return;
  emit('click', event);
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : 'false'"
    @click="onClick"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    ></span>
    <slot />
  </button>
</template>

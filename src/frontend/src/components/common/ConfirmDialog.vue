<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';

withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    confirmLabel: 'Excluir',
    cancelLabel: 'Cancelar',
  },
);

const emit = defineEmits<{ confirm: []; cancel: [] }>();
</script>

<template>
  <BaseModal :open="open" :title="title" initial-focus-selector="[data-autofocus]" @close="emit('cancel')">
    <p class="text-sm text-text-muted">{{ message }}</p>

    <template #footer>
      <BaseButton variant="secondary" data-autofocus @click="emit('cancel')">
        {{ cancelLabel }}
      </BaseButton>
      <BaseButton variant="danger" @click="emit('confirm')">{{ confirmLabel }}</BaseButton>
    </template>
  </BaseModal>
</template>

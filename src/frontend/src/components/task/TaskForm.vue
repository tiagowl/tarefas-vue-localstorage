<script setup lang="ts">
import { ref } from 'vue';
import type { TaskDraft } from '@/domain/models';
import { isValidTitle } from '@/domain/validation';
import BaseInput from '@/components/common/BaseInput.vue';

const props = withDefaults(
  defineProps<{
    initialTitle?: string;
    initialDescription?: string;
    submitLabel?: string;
  }>(),
  {
    initialTitle: '',
    initialDescription: '',
    submitLabel: 'Salvar',
  },
);

const emit = defineEmits<{
  submit: [draft: TaskDraft];
  cancel: [];
}>();

const title = ref(props.initialTitle);
const description = ref(props.initialDescription);
const error = ref('');

function onSubmit(): void {
  if (!isValidTitle(title.value)) {
    error.value = 'Nome é obrigatório.';
    return;
  }

  error.value = '';
  const trimmedDescription = description.value.trim();
  emit('submit', {
    title: title.value.trim(),
    description: trimmedDescription === '' ? undefined : trimmedDescription,
  });
}
</script>

<template>
  <form class="flex flex-col gap-4" novalidate @submit.prevent="onSubmit">
    <BaseInput
      v-model="title"
      label="Nome"
      placeholder="Ex.: Revisar proposta do cliente"
      :required="true"
      :error="error"
      :autofocus="true"
      @update:model-value="error = ''"
    />

    <BaseInput
      v-model="description"
      label="Descrição (opcional)"
      placeholder="Detalhes adicionais…"
      :rows="3"
    />

    <div class="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        class="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-text transition hover:bg-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        @click="emit('cancel')"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

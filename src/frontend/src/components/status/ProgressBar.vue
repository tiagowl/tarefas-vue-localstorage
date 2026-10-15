<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ done: number; total: number }>();

const isEmpty = computed(() => props.total <= 0);
const percent = computed(() => {
  if (isEmpty.value) return 0;
  return Math.round((props.done / props.total) * 100);
});
const label = computed(() => `${props.done}/${props.total}`);
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      v-if="!isEmpty"
      class="h-1.5 flex-1 overflow-hidden rounded-sm bg-border"
      role="progressbar"
      :aria-valuenow="done"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-label="`Progresso das subtarefas: ${label}`"
    >
      <div
        class="h-full rounded-sm bg-primary transition-all duration-150"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
    <span
      class="tabular-nums text-xs text-text-muted"
      :aria-label="isEmpty ? 'Sem subtarefas' : undefined"
    >
      {{ label }}
    </span>
  </div>
</template>

import { readonly, ref } from 'vue';
import { createId } from '@/domain/id';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

const MAX_TOASTS = 3;
const toasts = ref<ToastMessage[]>([]);

function dismissToast(id: string): void {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

function pushToast(message: string, variant: ToastVariant = 'info', duration = 4000): void {
  const toast: ToastMessage = { id: createId(), message, variant };
  toasts.value = [...toasts.value, toast].slice(-MAX_TOASTS);

  const autoDismissMs = variant === 'error' ? 0 : duration;
  if (autoDismissMs > 0) {
    setTimeout(() => dismissToast(toast.id), autoDismissMs);
  }
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    pushToast,
    dismissToast,
  };
}

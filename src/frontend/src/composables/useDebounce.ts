import { shallowRef, watch, type Ref } from 'vue';

export function useDebounce<T>(source: Ref<T>, delay = 200): Ref<T> {
  const debounced = shallowRef<T>(source.value);
  let timer: ReturnType<typeof setTimeout> | undefined;

  watch(source, (value) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = value;
    }, delay);
  });

  return debounced;
}

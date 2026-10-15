import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ProgressBar from '@/components/status/ProgressBar.vue';

describe('ProgressBar', () => {
  it('expõe valores acessíveis quando há subtarefas', () => {
    const wrapper = mount(ProgressBar, { props: { done: 2, total: 5 } });
    const bar = wrapper.find('[role="progressbar"]');

    expect(bar.exists()).toBe(true);
    expect(bar.attributes('aria-valuenow')).toBe('2');
    expect(bar.attributes('aria-valuemax')).toBe('5');
    expect(wrapper.text()).toContain('2/5');
  });

  it('mostra indicador neutro 0/0 sem barra quando não há subtarefas', () => {
    const wrapper = mount(ProgressBar, { props: { done: 0, total: 0 } });

    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('0/0');
  });
});

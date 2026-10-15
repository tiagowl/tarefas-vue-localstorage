import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import StatusBadge from '@/components/status/StatusBadge.vue';

describe('StatusBadge', () => {
  it('exibe rótulo textual e rótulo acessível para "Feito"', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'done' } });

    expect(wrapper.text()).toContain('Feito');
    expect(wrapper.attributes('aria-label')).toBe('Status: Feito');
  });

  it('exibe "A fazer" para o status todo', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'todo' } });
    expect(wrapper.text()).toContain('A fazer');
  });

  it('exibe "Fazendo" para o status doing', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'doing' } });
    expect(wrapper.text()).toContain('Fazendo');
  });
});

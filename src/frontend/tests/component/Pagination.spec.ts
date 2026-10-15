import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '@/components/list/Pagination.vue';

describe('Pagination', () => {
  it('desabilita "Anterior" na primeira página e emite next', async () => {
    const wrapper = mount(Pagination, { props: { page: 1, totalPages: 3 } });
    const buttons = wrapper.findAll('button');

    expect(buttons[0].attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('Página 1 de 3');

    await buttons[1].trigger('click');
    expect(wrapper.emitted('next')).toHaveLength(1);
  });

  it('desabilita "Próxima" na última página e emite prev', async () => {
    const wrapper = mount(Pagination, { props: { page: 3, totalPages: 3 } });
    const buttons = wrapper.findAll('button');

    expect(buttons[1].attributes('disabled')).toBeDefined();

    await buttons[0].trigger('click');
    expect(wrapper.emitted('prev')).toHaveLength(1);
  });
});

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import SearchBar from '@/components/search/SearchBar.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/search', name: 'search', component: { template: '<div />' } },
    ],
  })
}

describe('SearchBar', () => {
  it('renders search input', () => {
    const wrapper = mount(SearchBar, {
      global: { plugins: [createTestRouter()] },
    })

    const input = wrapper.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Search shows...')
  })

  it('has proper aria label', () => {
    const wrapper = mount(SearchBar, {
      global: { plugins: [createTestRouter()] },
    })

    expect(wrapper.find('input').attributes('aria-label')).toBe('Search TV shows')
  })

  it('has search role on form', () => {
    const wrapper = mount(SearchBar, {
      global: { plugins: [createTestRouter()] },
    })

    expect(wrapper.find('form').attributes('role')).toBe('search')
  })

  it('navigates on form submit', async () => {
    const router = createTestRouter()
    const pushSpy = vi.spyOn(router, 'push')
    const wrapper = mount(SearchBar, {
      global: { plugins: [router] },
    })

    await wrapper.find('input').setValue('test')
    await wrapper.find('form').trigger('submit')

    expect(pushSpy).toHaveBeenCalledWith({ name: 'search', query: { q: 'test' } })
  })
})

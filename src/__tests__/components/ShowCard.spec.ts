import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ShowCard from '@/components/show/ShowCard.vue'
import { mockShow, mockShowNoImage } from '../fixtures/shows'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/shows/:id', component: { template: '<div />' } },
    ],
  })
}

describe('ShowCard', () => {
  it('renders show name', () => {
    const wrapper = mount(ShowCard, {
      props: { show: mockShow },
      global: { plugins: [createTestRouter()] },
    })

    expect(wrapper.text()).toContain('Breaking Bad')
  })

  it('renders poster image when available', () => {
    const wrapper = mount(ShowCard, {
      props: { show: mockShow },
      global: { plugins: [createTestRouter()] },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockShow.image!.medium)
    expect(img.attributes('alt')).toBe('Breaking Bad')
  })

  it('renders placeholder when no image', () => {
    const wrapper = mount(ShowCard, {
      props: { show: mockShowNoImage },
      global: { plugins: [createTestRouter()] },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.poster-placeholder').exists()).toBe(true)
  })

  it('links to show detail page', () => {
    const wrapper = mount(ShowCard, {
      props: { show: mockShow },
      global: { plugins: [createTestRouter()] },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/shows/1')
  })

  it('displays rating badge', () => {
    const wrapper = mount(ShowCard, {
      props: { show: mockShow },
      global: { plugins: [createTestRouter()] },
    })

    expect(wrapper.text()).toContain('9.2')
  })
})

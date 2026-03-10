import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ShowCarousel from '@/components/show/ShowCarousel.vue'
import { mockShow, mockShowMidRating } from '../fixtures/shows'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/shows/:id', component: { template: '<div />' } },
    ],
  })
}

describe('ShowCarousel', () => {
  it('renders all show cards', () => {
    const wrapper = mount(ShowCarousel, {
      props: { shows: [mockShow, mockShowMidRating] },
      global: { plugins: [createTestRouter()] },
    })

    const cards = wrapper.findAll('.show-card')
    expect(cards).toHaveLength(2)
  })

  it('renders scroll buttons', () => {
    const wrapper = mount(ShowCarousel, {
      props: { shows: [mockShow] },
      global: { plugins: [createTestRouter()] },
    })

    const buttons = wrapper.findAll('.scroll-btn')
    expect(buttons).toHaveLength(2)
  })

  it('has a scrollable track', () => {
    const wrapper = mount(ShowCarousel, {
      props: { shows: [mockShow] },
      global: { plugins: [createTestRouter()] },
    })

    expect(wrapper.find('.carousel-track').exists()).toBe(true)
  })
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingBadge from '@/components/ui/RatingBadge.vue'

describe('RatingBadge', () => {
  it('displays formatted rating', () => {
    const wrapper = mount(RatingBadge, { props: { rating: 8.5 } })
    expect(wrapper.text()).toContain('8.5')
  })

  it('displays N/A for null rating', () => {
    const wrapper = mount(RatingBadge, { props: { rating: null } })
    expect(wrapper.text()).toContain('N/A')
  })

  it('uses green color for high rating (8+)', () => {
    const wrapper = mount(RatingBadge, { props: { rating: 9.0 } })
    const badge = wrapper.find('.rating-badge')
    expect(badge.attributes('style')).toContain('--color-rating-high')
  })

  it('uses yellow color for mid rating (6-8)', () => {
    const wrapper = mount(RatingBadge, { props: { rating: 7.0 } })
    const badge = wrapper.find('.rating-badge')
    expect(badge.attributes('style')).toContain('--color-rating-mid')
  })

  it('uses red color for low rating (<6)', () => {
    const wrapper = mount(RatingBadge, { props: { rating: 4.0 } })
    const badge = wrapper.find('.rating-badge')
    expect(badge.attributes('style')).toContain('--color-rating-low')
  })
})

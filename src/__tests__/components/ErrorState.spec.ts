import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorState from '@/components/ui/ErrorState.vue'

describe('ErrorState', () => {
  it('displays error message', () => {
    const wrapper = mount(ErrorState, { props: { message: 'Something went wrong' } })
    expect(wrapper.text()).toContain('Something went wrong')
  })

  it('has a retry button', () => {
    const wrapper = mount(ErrorState, { props: { message: 'Error' } })
    expect(wrapper.find('button').text()).toBe('Try again')
  })

  it('emits retry on button click', async () => {
    const wrapper = mount(ErrorState, { props: { message: 'Error' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})

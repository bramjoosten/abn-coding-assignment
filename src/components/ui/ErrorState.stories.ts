import type { Meta, StoryObj } from '@storybook/vue3'
import ErrorState from './ErrorState.vue'

const meta: Meta<typeof ErrorState> = {
  title: 'Compositions/ErrorState',
  component: ErrorState,
}
export default meta

type Story = StoryObj<typeof ErrorState>

export const Default: Story = {
  args: { message: 'Failed to load shows. Please check your connection and try again.' },
}

export const ShortMessage: Story = {
  args: { message: 'Something went wrong.' },
}

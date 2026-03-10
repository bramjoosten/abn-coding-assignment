import type { Meta, StoryObj } from '@storybook/vue3'
import RatingBadge from './RatingBadge.vue'

const meta: Meta<typeof RatingBadge> = {
  title: 'Elements/RatingBadge',
  component: RatingBadge,
  argTypes: {
    rating: { control: { type: 'number', min: 0, max: 10, step: 0.1 } },
  },
}
export default meta

type Story = StoryObj<typeof RatingBadge>

export const High: Story = { args: { rating: 9.2 } }
export const Mid: Story = { args: { rating: 7.0 } }
export const Low: Story = { args: { rating: 4.5 } }
export const NoRating: Story = { args: { rating: null } }

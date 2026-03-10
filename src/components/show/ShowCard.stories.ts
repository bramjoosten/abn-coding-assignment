import type { Meta, StoryObj } from '@storybook/vue3'
import ShowCard from './ShowCard.vue'
import { sampleShow, sampleShowNoImage, sampleShowLowRating } from '@/stories/_fixtures'

const meta: Meta<typeof ShowCard> = {
  title: 'Compositions/ShowCard',
  component: ShowCard,
  decorators: [
    () => ({ template: '<div style="width: 180px;"><story /></div>' }),
  ],
}
export default meta

type Story = StoryObj<typeof ShowCard>

export const Default: Story = { args: { show: sampleShow } }
export const NoImage: Story = { args: { show: sampleShowNoImage } }
export const LowRating: Story = { args: { show: sampleShowLowRating } }

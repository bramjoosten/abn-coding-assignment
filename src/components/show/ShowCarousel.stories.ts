import type { Meta, StoryObj } from '@storybook/vue3'
import ShowCarousel from './ShowCarousel.vue'
import { sampleShows, sampleShow } from '@/stories/_fixtures'

const meta: Meta<typeof ShowCarousel> = {
  title: 'Compositions/ShowCarousel',
  component: ShowCarousel,
}
export default meta

type Story = StoryObj<typeof ShowCarousel>

export const Default: Story = { args: { shows: sampleShows } }

export const FewItems: Story = {
  args: { shows: [sampleShow] },
}

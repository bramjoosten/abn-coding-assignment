import type { Meta, StoryObj } from '@storybook/vue3'
import SkeletonCard from './SkeletonCard.vue'

const meta: Meta<typeof SkeletonCard> = {
  title: 'Elements/SkeletonCard',
  component: SkeletonCard,
}
export default meta

type Story = StoryObj<typeof SkeletonCard>

export const Default: Story = {}

export const Row: Story = {
  render: () => ({
    components: { SkeletonCard },
    template: `
      <div style="display: flex; gap: 16px; overflow: hidden;">
        <SkeletonCard v-for="i in 6" :key="i" />
      </div>
    `,
  }),
}

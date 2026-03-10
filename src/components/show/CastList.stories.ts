import type { Meta, StoryObj } from '@storybook/vue3'
import CastList from './CastList.vue'
import { sampleCast } from '@/stories/_fixtures'

const meta: Meta<typeof CastList> = {
  title: 'Compositions/CastList',
  component: CastList,
}
export default meta

type Story = StoryObj<typeof CastList>

export const Default: Story = { args: { cast: sampleCast } }
export const Empty: Story = { args: { cast: [] } }

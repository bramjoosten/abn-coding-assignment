import type { Meta, StoryObj } from '@storybook/vue3'
import ShowInfo from './ShowInfo.vue'
import { sampleShowDetail, sampleShowNoImage } from '@/stories/_fixtures'

const meta: Meta<typeof ShowInfo> = {
  title: 'Compositions/ShowInfo',
  component: ShowInfo,
}
export default meta

type Story = StoryObj<typeof ShowInfo>

export const Default: Story = { args: { show: sampleShowDetail } }

export const NoImage: Story = {
  args: { show: { ...sampleShowNoImage, _embedded: {} } },
}

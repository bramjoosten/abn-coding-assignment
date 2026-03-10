import type { Meta, StoryObj } from '@storybook/vue3'
import EpisodeList from './EpisodeList.vue'
import { sampleSeasonMap } from '@/stories/_fixtures'

const meta: Meta<typeof EpisodeList> = {
  title: 'Compositions/EpisodeList',
  component: EpisodeList,
}
export default meta

type Story = StoryObj<typeof EpisodeList>

export const Default: Story = { args: { seasonMap: sampleSeasonMap } }
export const Empty: Story = { args: { seasonMap: new Map() } }

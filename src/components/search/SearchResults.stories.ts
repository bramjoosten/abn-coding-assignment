import type { Meta, StoryObj } from '@storybook/vue3'
import SearchResults from './SearchResults.vue'
import { sampleShows } from '@/stories/_fixtures'

const meta: Meta<typeof SearchResults> = {
  title: 'Compositions/SearchResults',
  component: SearchResults,
}
export default meta

type Story = StoryObj<typeof SearchResults>

export const Default: Story = { args: { shows: sampleShows } }
export const Empty: Story = { args: { shows: [] } }

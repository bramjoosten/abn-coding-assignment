import type { Meta, StoryObj } from '@storybook/vue3'
import GenreSection from './GenreSection.vue'
import { sampleShows } from '@/stories/_fixtures'

const meta: Meta<typeof GenreSection> = {
  title: 'Compositions/GenreSection',
  component: GenreSection,
}
export default meta

type Story = StoryObj<typeof GenreSection>

export const Default: Story = {
  args: { genre: 'Drama', shows: sampleShows },
}

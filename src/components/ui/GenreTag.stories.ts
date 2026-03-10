import type { Meta, StoryObj } from '@storybook/vue3'
import GenreTag from './GenreTag.vue'

const meta: Meta<typeof GenreTag> = {
  title: 'Elements/GenreTag',
  component: GenreTag,
}
export default meta

type Story = StoryObj<typeof GenreTag>

export const AllGenres: Story = {
  render: () => ({
    components: { GenreTag },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <GenreTag v-for="g in genres" :key="g" :genre="g" />
      </div>
    `,
    setup: () => ({
      genres: [
        'Drama', 'Comedy', 'Action', 'Crime', 'Thriller', 'Science-Fiction',
        'Horror', 'Romance', 'Adventure', 'Fantasy', 'Mystery', 'Family',
        'Anime', 'Music', 'War', 'History', 'Western', 'Sports', 'Medical',
        'Legal', 'Espionage', 'Supernatural', 'Nature', 'Children', 'Food',
      ],
    }),
  }),
}

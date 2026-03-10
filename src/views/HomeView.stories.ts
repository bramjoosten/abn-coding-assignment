import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent } from 'vue'
import GenreSection from '@/components/show/GenreSection.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { sampleShows, sampleShowRunning, sampleShowLowRating } from '@/stories/_fixtures'

const HomePage = defineComponent({
  components: { GenreSection, SkeletonCard, ErrorState },
  props: {
    state: { type: String, default: 'loaded' },
  },
  setup(props) {
    const genres = new Map([
      ['Crime', sampleShows],
      ['Drama', [sampleShowRunning, ...sampleShows.slice(0, 4)]],
      ['Comedy', [sampleShowLowRating, ...sampleShows.slice(2, 6)]],
    ])
    return { genres, sortedGenres: [...genres.keys()], state: props.state }
  },
  template: `
    <main style="padding: 24px 0 48px;">
      <!-- Loading -->
      <div v-if="state === 'loading'" style="padding: 0 var(--page-padding);">
        <div v-for="i in 3" :key="i" style="margin-bottom: 32px;">
          <div style="height: 22px; width: 140px; border-radius: 4px; margin-bottom: 12px; background: var(--color-skeleton);" />
          <div style="display: flex; gap: var(--card-gap); overflow: hidden;">
            <SkeletonCard v-for="j in 8" :key="j" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="state === 'error'" style="display: flex; align-items: center; justify-content: center; min-height: 60vh;">
        <ErrorState message="Failed to load shows. Please check your connection." />
      </div>

      <!-- Loaded -->
      <template v-else>
        <GenreSection
          v-for="genre in sortedGenres"
          :key="genre"
          :genre="genre"
          :shows="genres.get(genre) ?? []"
        />
      </template>
    </main>
  `,
})

const meta: Meta<typeof HomePage> = {
  title: 'Pages/Home',
  component: HomePage,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof HomePage>

export const Loaded: Story = { args: { state: 'loaded' } }
export const Loading: Story = { args: { state: 'loading' } }
export const Error: Story = { args: { state: 'error' } }

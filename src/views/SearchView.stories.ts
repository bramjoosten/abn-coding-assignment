import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent } from 'vue'
import SearchResults from '@/components/search/SearchResults.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { sampleShows } from '@/stories/_fixtures'

const SearchPage = defineComponent({
  components: { SearchResults, ErrorState },
  props: {
    state: { type: String, default: 'results' },
  },
  setup(props) {
    return { shows: sampleShows, state: props.state, query: 'breaking' }
  },
  template: `
    <main style="padding: 24px 0;">
      <h1 style="padding: 0 var(--page-padding); margin-bottom: 24px; font-weight: 400;">
        Results for <span style="font-weight: 700; color: var(--color-accent);">"{{ query }}"</span>
      </h1>

      <!-- Loading -->
      <div v-if="state === 'loading'" style="display: flex; justify-content: center; padding: 64px 0;">
        <div style="width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.8s linear infinite;" />
      </div>

      <!-- Error -->
      <ErrorState v-else-if="state === 'error'" message="Search failed. Please try again." />

      <!-- Results -->
      <SearchResults v-else-if="state === 'results'" :shows="shows" />

      <!-- Empty -->
      <div v-else-if="state === 'empty'" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px 24px; color: var(--color-text-dim);">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--color-text-dim)" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>No shows found for "{{ query }}"</p>
      </div>

      <!-- Initial -->
      <div v-else style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 64px 24px; color: var(--color-text-dim);">
        <p>Type a show name to search</p>
      </div>
    </main>
  `,
})

const meta: Meta<typeof SearchPage> = {
  title: 'Pages/Search',
  component: SearchPage,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof SearchPage>

export const Results: Story = { args: { state: 'results' } }
export const Empty: Story = { args: { state: 'empty' } }
export const Loading: Story = { args: { state: 'loading' } }
export const Error: Story = { args: { state: 'error' } }
export const Initial: Story = { args: { state: 'initial' } }

import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent } from 'vue'
import ShowInfo from '@/components/show/ShowInfo.vue'
import CastList from '@/components/show/CastList.vue'
import EpisodeList from '@/components/show/EpisodeList.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { sampleShowDetail, sampleCast, sampleSeasonMap, sampleShowNoImage } from '@/stories/_fixtures'
import type { ShowDetail } from '@/types/show'

const ShowDetailPage = defineComponent({
  components: { ShowInfo, CastList, EpisodeList, ErrorState, AppButton },
  props: {
    state: { type: String, default: 'loaded' },
  },
  setup(props) {
    const show: ShowDetail = sampleShowDetail
    const showNoImage: ShowDetail = { ...sampleShowNoImage, _embedded: { cast: [], episodes: [] } }
    return { show, showNoImage, cast: sampleCast, seasonMap: sampleSeasonMap, state: props.state }
  },
  template: `
    <main style="padding: 24px 0; display: flex; flex-direction: column; gap: 32px;">
      <AppButton variant="info" size="sm" style="margin: 0 var(--page-padding); align-self: flex-start;">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back
      </AppButton>

      <!-- Loading -->
      <div v-if="state === 'loading'" style="display: flex; justify-content: center; padding: 64px 0;">
        <div style="width: 40px; height: 40px; border: 3px solid var(--color-border); border-top-color: var(--color-accent); border-radius: 50%; animation: spin 0.8s linear infinite;" />
      </div>

      <!-- Error -->
      <ErrorState v-else-if="state === 'error'" message="Show not found or network error." />

      <!-- Content -->
      <template v-else>
        <ShowInfo :show="state === 'no-image' ? showNoImage : show" />
        <CastList :cast="cast" />
        <EpisodeList :season-map="seasonMap" />
      </template>
    </main>
  `,
})

const meta: Meta<typeof ShowDetailPage> = {
  title: 'Pages/Show Detail',
  component: ShowDetailPage,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof ShowDetailPage>

export const Loaded: Story = { args: { state: 'loaded' } }
export const NoImage: Story = { args: { state: 'no-image' } }
export const Loading: Story = { args: { state: 'loading' } }
export const Error: Story = { args: { state: 'error' } }

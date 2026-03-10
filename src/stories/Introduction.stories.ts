import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h } from 'vue'

const IntroPage = defineComponent({
  render() {
    return h('div', { style: 'max-width: 640px; font-family: Inter, system-ui, sans-serif; color: #eaeaea; line-height: 1.7;' }, [
      h('h1', { style: 'font-size: 2rem; font-weight: 700; margin-bottom: 8px;' }, 'TV Show Dashboard'),
      h('p', { style: 'color: #8a8a9a; margin-bottom: 32px;' }, 'Component library organized in three tiers.'),

      h('h2', { style: 'font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; color: #4ecb71;' }, 'Elements'),
      h('p', { style: 'color: #8a8a9a; margin-bottom: 24px;' },
        'Isolated, single-purpose components. No domain logic, no child component imports \u2014 just props in, visuals out. Inspect these one at a time to verify sizing, color, and internal spacing. Examples: RatingBadge, GenreTag, SkeletonCard, ErrorState.'
      ),

      h('h2', { style: 'font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; color: #f0c929;' }, 'Compositions'),
      h('p', { style: 'color: #8a8a9a; margin-bottom: 24px;' },
        'Multiple elements working together. Study these to verify integration: whitespace between elements, alignment, overflow behavior, and how components respond to each other\u2019s sizing. A ShowCard composes RatingBadge with show-specific layout; a ShowCarousel composes multiple ShowCards with scroll behavior and gap spacing.'
      ),

      h('h2', { style: 'font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; color: #7b68ee;' }, 'Pages'),
      h('p', { style: 'color: #8a8a9a; margin-bottom: 24px;' },
        'Full route-level views rendered with fixture data. Each page story covers loading, error, empty, and loaded states — so you can preview every view without leaving Storybook. This keeps all visual tracking in one place and ensures consistency across the app.'
      ),
    ])
  },
})

const meta: Meta<typeof IntroPage> = {
  title: 'Introduction',
  component: IntroPage,
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
  },
}
export default meta

type Story = StoryObj<typeof IntroPage>

export const Overview: Story = {}

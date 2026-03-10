import type { Meta, StoryObj } from '@storybook/vue3'
import AppDisclosure from './AppDisclosure.vue'

const meta: Meta<typeof AppDisclosure> = {
  title: 'Elements/AppDisclosure',
  component: AppDisclosure,
}
export default meta

type Story = StoryObj<typeof AppDisclosure>

export const Closed: Story = {
  args: { label: 'Season 1', detail: '7 episodes' },
  render: (args) => ({
    components: { AppDisclosure },
    setup: () => ({ args }),
    template: `
      <AppDisclosure v-bind="args">
        <div style="padding: 12px 16px; font-size: 0.875rem; color: var(--color-text-muted);">
          Content goes here
        </div>
      </AppDisclosure>
    `,
  }),
}

export const Open: Story = {
  args: { label: 'Season 1', detail: '7 episodes', open: true },
  render: (args) => ({
    components: { AppDisclosure },
    setup: () => ({ args }),
    template: `
      <AppDisclosure v-bind="args">
        <div style="padding: 12px 16px; font-size: 0.875rem; color: var(--color-text-muted);">
          Content goes here
        </div>
      </AppDisclosure>
    `,
  }),
}

export const Stacked: Story = {
  render: () => ({
    components: { AppDisclosure },
    template: `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <AppDisclosure label="Section A" detail="3 items" :open="true">
          <div style="padding: 12px 16px; font-size: 0.875rem; color: var(--color-text-muted);">First section content</div>
        </AppDisclosure>
        <AppDisclosure label="Section B" detail="5 items">
          <div style="padding: 12px 16px; font-size: 0.875rem; color: var(--color-text-muted);">Second section content</div>
        </AppDisclosure>
        <AppDisclosure label="Section C">
          <div style="padding: 12px 16px; font-size: 0.875rem; color: var(--color-text-muted);">Third section content</div>
        </AppDisclosure>
      </div>
    `,
  }),
}

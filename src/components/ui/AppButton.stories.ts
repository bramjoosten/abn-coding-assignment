import type { Meta, StoryObj } from '@storybook/vue3'
import AppButton from './AppButton.vue'

const meta: Meta<typeof AppButton> = {
  title: 'Elements/AppButton',
  component: AppButton,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'info', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
}
export default meta

type Story = StoryObj<typeof AppButton>

export const AllVariants: Story = {
  render: () => ({
    components: { AppButton },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <AppButton variant="primary">Primary</AppButton>
          <AppButton variant="info">Info</AppButton>
          <AppButton variant="success">Success</AppButton>
          <AppButton variant="warning">Warning</AppButton>
          <AppButton variant="error">Error</AppButton>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <AppButton variant="primary" size="sm">Primary sm</AppButton>
          <AppButton variant="info" size="sm">Info sm</AppButton>
          <AppButton variant="success" size="sm">Success sm</AppButton>
          <AppButton variant="warning" size="sm">Warning sm</AppButton>
          <AppButton variant="error" size="sm">Error sm</AppButton>
        </div>
      </div>
    `,
  }),
}

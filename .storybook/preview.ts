import type { Preview } from '@storybook/vue3'
import '../src/assets/styles/main.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'surface', value: '#0f2626' },
      ],
    },
    options: {
      storySort: {
        order: ['Introduction', 'Elements', 'Compositions', 'Pages'],
      },
    },
  },
}

export default preview

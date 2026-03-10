import { vi } from 'vitest'

// Global fetch mock
vi.stubGlobal('fetch', vi.fn())

// jsdom does not provide ResizeObserver
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)

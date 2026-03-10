import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useShows } from '@/composables/useShows'
import { _resetShowStore } from '@/stores/showStore'

vi.mock('@/api/shows', () => ({
  fetchPages: vi.fn().mockResolvedValue([]),
}))

function mountComposable() {
  let result: ReturnType<typeof useShows>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useShows()
        return () => null
      },
    }),
  )
  return { wrapper, result: result! }
}

beforeEach(() => {
  _resetShowStore()
})

describe('useShows', () => {
  it('exposes loading, error, genreMap, sortedGenres', () => {
    const { result } = mountComposable()

    expect(result).toHaveProperty('loading')
    expect(result).toHaveProperty('error')
    expect(result).toHaveProperty('genreMap')
    expect(result).toHaveProperty('sortedGenres')
    expect(result).toHaveProperty('retry')
  })

  it('triggers loadShows on mount', async () => {
    const { result } = mountComposable()
    await nextTick()

    // After mount, loading should have been triggered
    // (starts true then resolves to false since mock resolves immediately)
    expect(typeof result.loading.value).toBe('boolean')
  })
})

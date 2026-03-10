import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { mockSearchResults } from '../fixtures/shows'

vi.mock('@/api/shows', () => ({
  searchShows: vi.fn(),
}))

import { searchShows } from '@/api/shows'
const mockSearchShows = vi.mocked(searchShows)

beforeEach(() => {
  mockSearchShows.mockReset()
  vi.useFakeTimers()
})

describe('useSearch', () => {
  it('returns empty results for empty query', () => {
    const query = ref('')
    const { results, searched } = useSearch(() => query.value)

    expect(results.value).toEqual([])
    expect(searched.value).toBe(false)
  })

  it('debounces search calls', async () => {
    mockSearchShows.mockResolvedValue(mockSearchResults)

    const query = ref('')
    const { results, loading } = useSearch(() => query.value)

    query.value = 'break'
    await nextTick()

    // Should set loading immediately
    expect(loading.value).toBe(true)

    // But not call API yet (debounced)
    expect(mockSearchShows).not.toHaveBeenCalled()

    // Advance past debounce
    vi.advanceTimersByTime(300)
    await nextTick()
    await vi.runAllTimersAsync()

    expect(mockSearchShows).toHaveBeenCalledWith('break')
  })

  it('maps search results to shows', async () => {
    mockSearchShows.mockResolvedValue(mockSearchResults)

    const query = ref('breaking')
    useSearch(() => query.value)

    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()
    await nextTick()

    // The search should have been called
    expect(mockSearchShows).toHaveBeenCalledWith('breaking')
  })

  it('clears results when query is emptied', async () => {
    mockSearchShows.mockResolvedValue(mockSearchResults)

    const query = ref('test')
    const { results, searched } = useSearch(() => query.value)

    vi.advanceTimersByTime(300)
    await vi.runAllTimersAsync()
    await nextTick()

    query.value = ''
    await nextTick()

    expect(results.value).toEqual([])
    expect(searched.value).toBe(false)
  })
})

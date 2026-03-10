import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useShowStore, _resetShowStore } from '@/stores/showStore'
import { mockShow, mockShowNoImage, mockShowLowRating, mockShowMidRating } from '../fixtures/shows'

vi.mock('@/api/shows', () => ({
  fetchPages: vi.fn(),
}))

import { fetchPages } from '@/api/shows'
const mockFetchPages = vi.mocked(fetchPages)

beforeEach(() => {
  _resetShowStore()
  mockFetchPages.mockReset()
})

describe('showStore', () => {
  it('starts with empty state', () => {
    const store = useShowStore()
    expect(store.shows.value).toEqual([])
    expect(store.loading.value).toBe(false)
    expect(store.error.value).toBeNull()
    expect(store.canFetchMore.value).toBe(true)
  })

  it('loads shows and builds genre map', async () => {
    mockFetchPages.mockResolvedValue([mockShow, mockShowMidRating])

    const store = useShowStore()
    await store.loadShows()

    expect(store.shows.value).toHaveLength(2)
    expect(store.genreMap.value.has('Drama')).toBe(true)
    expect(store.genreMap.value.has('Crime')).toBe(true)
    // Drama has both shows, sorted by rating
    expect(store.genreMap.value.get('Drama')![0].name).toBe('Breaking Bad')
    expect(store.genreMap.value.get('Drama')![1].name).toBe('Mid Rated Show')
  })

  it('sorts shows by rating descending within genre', async () => {
    mockFetchPages.mockResolvedValue([mockShowMidRating, mockShow, mockShowLowRating])

    const store = useShowStore()
    await store.loadShows()

    const dramaShows = store.genreMap.value.get('Drama')!
    expect(dramaShows[0].rating.average).toBe(9.2)
    expect(dramaShows[1].rating.average).toBe(7.0)
  })

  it('places null ratings last', async () => {
    const showNullRating = { ...mockShowMidRating, id: 99, genres: ['Drama'], rating: { average: null } }
    mockFetchPages.mockResolvedValue([showNullRating, mockShow])

    const store = useShowStore()
    await store.loadShows()

    const dramaShows = store.genreMap.value.get('Drama')!
    expect(dramaShows[0].rating.average).toBe(9.2)
    expect(dramaShows[1].rating.average).toBeNull()
  })

  it('skips shows with no genres', async () => {
    mockFetchPages.mockResolvedValue([mockShowNoImage])

    const store = useShowStore()
    await store.loadShows()

    expect(store.genreMap.value.size).toBe(0)
  })

  it('handles load error', async () => {
    mockFetchPages.mockRejectedValue(new Error('Network error'))

    const store = useShowStore()
    await store.loadShows()

    expect(store.error.value).toBe('Network error')
    expect(store.canFetchMore.value).toBe(true)
  })

  it('does not reload if already loaded', async () => {
    mockFetchPages.mockResolvedValue([mockShow])

    const store = useShowStore()
    await store.loadShows()
    await store.loadShows()

    expect(mockFetchPages).toHaveBeenCalledTimes(1)
  })

  it('sorts genre names alphabetically', async () => {
    mockFetchPages.mockResolvedValue([mockShow, mockShowLowRating])

    const store = useShowStore()
    await store.loadShows()

    const genres = store.sortedGenres.value
    expect(genres).toEqual(['Comedy', 'Crime', 'Drama'])
  })

  it('requestBackfill fetches more pages for sparse genres', async () => {
    mockFetchPages.mockResolvedValue([mockShow])

    const store = useShowStore()
    await store.loadShows()
    expect(store.shows.value).toHaveLength(1)

    // First backfill batch returns more shows, then empty to signal exhaustion
    mockFetchPages
      .mockResolvedValueOnce([mockShowMidRating, mockShowLowRating])
      .mockResolvedValue([])
    store.requestBackfill('Drama')

    // Wait for the async backfill to complete
    await new Promise((r) => setTimeout(r, 50))

    expect(store.shows.value).toHaveLength(3)
  })
})

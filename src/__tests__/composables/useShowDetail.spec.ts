import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useShowDetail } from '@/composables/useShowDetail'
import { mockShowDetail } from '../fixtures/shows'

vi.mock('@/api/shows', () => ({
  fetchShowById: vi.fn(),
}))

import { fetchShowById } from '@/api/shows'
const mockFetchShowById = vi.mocked(fetchShowById)

beforeEach(() => {
  mockFetchShowById.mockReset()
})

describe('useShowDetail', () => {
  it('fetches show on init', async () => {
    mockFetchShowById.mockResolvedValue(mockShowDetail)

    const id = ref(1)
    const { show, loading } = useShowDetail(() => id.value)

    // Initially loading
    expect(loading.value).toBe(true)

    await vi.waitFor(() => {
      expect(show.value).toEqual(mockShowDetail)
    })
    expect(loading.value).toBe(false)
  })

  it('groups episodes by season', async () => {
    mockFetchShowById.mockResolvedValue(mockShowDetail)

    const id = ref(1)
    const { seasonMap } = useShowDetail(() => id.value)

    await vi.waitFor(() => {
      expect(seasonMap.value.size).toBe(2)
    })
    expect(seasonMap.value.get(1)).toHaveLength(2)
    expect(seasonMap.value.get(2)).toHaveLength(1)
  })

  it('exposes cast from embedded data', async () => {
    mockFetchShowById.mockResolvedValue(mockShowDetail)

    const id = ref(1)
    const { cast } = useShowDetail(() => id.value)

    await vi.waitFor(() => {
      expect(cast.value).toHaveLength(2)
    })
    expect(cast.value[0].person.name).toBe('Bryan Cranston')
  })

  it('handles errors', async () => {
    mockFetchShowById.mockRejectedValue(new Error('Not found'))

    const id = ref(999)
    const { error, loading } = useShowDetail(() => id.value)

    await vi.waitFor(() => {
      expect(error.value).toBe('Not found')
    })
    expect(loading.value).toBe(false)
  })

  it('refetches when id changes', async () => {
    mockFetchShowById.mockResolvedValue(mockShowDetail)

    const id = ref(1)
    useShowDetail(() => id.value)

    await vi.waitFor(() => {
      expect(mockFetchShowById).toHaveBeenCalledWith(1)
    })

    id.value = 2
    await nextTick()

    expect(mockFetchShowById).toHaveBeenCalledWith(2)
  })
})

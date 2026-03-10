import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchShowsPage, fetchPages, searchShows, fetchShowById } from '@/api/shows'
import { mockShow, mockShowDetail, mockSearchResults } from '../fixtures/shows'

const mockFetch = vi.mocked(fetch)

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }))
}

beforeEach(() => {
  mockFetch.mockReset()
})

describe('fetchShowsPage', () => {
  it('calls correct URL and returns shows', async () => {
    mockFetch.mockReturnValue(jsonResponse([mockShow]))

    const result = await fetchShowsPage(0)
    expect(result).toEqual([mockShow])
    expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=0')
  })

  it('calls correct URL for page 2', async () => {
    mockFetch.mockReturnValue(jsonResponse([]))

    await fetchShowsPage(2)
    expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows?page=2')
  })
})

describe('fetchPages', () => {
  it('fetches a range of pages in parallel', async () => {
    mockFetch.mockImplementation(() => jsonResponse([mockShow]))

    const result = await fetchPages(0, 3)
    expect(mockFetch).toHaveBeenCalledTimes(3)
    expect(result).toHaveLength(3)
  })
})

describe('searchShows', () => {
  it('calls search endpoint with encoded query', async () => {
    mockFetch.mockReturnValue(jsonResponse(mockSearchResults))

    const result = await searchShows('breaking bad')
    expect(result).toEqual(mockSearchResults)
    expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=breaking%20bad')
  })
})

describe('fetchShowById', () => {
  it('fetches show with cast and episodes embedded', async () => {
    mockFetch.mockReturnValue(jsonResponse(mockShowDetail))

    const result = await fetchShowById(1)
    expect(result).toEqual(mockShowDetail)
    expect(mockFetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1?embed[]=cast&embed[]=episodes')
  })
})

describe('error handling', () => {
  it('throws on non-429 errors', async () => {
    mockFetch.mockReturnValue(jsonResponse(null, 404))

    await expect(fetchShowsPage(999)).rejects.toThrow('API error: 404')
  })

  it('retries on 429 rate limit', async () => {
    mockFetch
      .mockReturnValueOnce(Promise.resolve(new Response(null, { status: 429 })))
      .mockReturnValue(jsonResponse([mockShow]))

    const result = await fetchShowsPage(0)
    expect(result).toEqual([mockShow])
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
})

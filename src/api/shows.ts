/**
 * @fileoverview TVMaze API endpoints for shows, search, and show details.
 * All functions return typed responses via {@link apiGet}.
 */

import { apiGet } from './client'
import type { Show, ShowDetail, SearchResult } from '@/types/show'

export function fetchShowsPage(page: number): Promise<Show[]> {
  return apiGet<Show[]>(`/shows?page=${page}`)
}

export async function fetchPages(from: number, to: number): Promise<Show[]> {
  const requests = Array.from({ length: to - from }, (_, i) => fetchShowsPage(from + i))
  const results = await Promise.all(requests)
  return results.flat()
}

export function searchShows(query: string): Promise<SearchResult[]> {
  return apiGet<SearchResult[]>(`/search/shows?q=${encodeURIComponent(query)}`)
}

export function fetchShowById(id: number): Promise<ShowDetail> {
  return apiGet<ShowDetail>(`/shows/${id}?embed[]=cast&embed[]=episodes`)
}

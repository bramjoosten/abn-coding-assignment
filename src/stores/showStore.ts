/**
 * @fileoverview Singleton show store using module-scoped Vue refs. Manages
 * progressive API loading, genre grouping/sorting, and user genre preferences.
 */

import { ref, computed } from 'vue'
import { fetchPages } from '@/api/shows'
import { EXCLUDED_GENRES, API_INITIAL_PAGES, API_MAX_PAGES, PREFS_STORAGE_KEY } from '@/constants'
import type { Show } from '@/types/show'

const shows = ref<Show[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagesLoaded = ref(0)

const hasMore = computed(() => pagesLoaded.value < API_MAX_PAGES)

// ── Genre preferences ───────────────────────────────────────────────────────

function loadPrefs(): string[] {
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const preferredGenres = ref<string[]>(loadPrefs())
const hasChosenPrefs = ref(localStorage.getItem(PREFS_STORAGE_KEY) !== null)
const showGenrePicker = ref(false)

function setPreferredGenres(genres: string[]) {
  preferredGenres.value = genres
  hasChosenPrefs.value = true
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(genres))
}

const genreMap = computed(() => {
  const map = new Map<string, Show[]>()

  for (const show of shows.value) {
    if (show.genres.length === 0) continue
    for (const genre of show.genres) {
      if (EXCLUDED_GENRES.includes(genre)) continue
      if (!map.has(genre)) map.set(genre, [])
      map.get(genre)!.push(show)
    }
  }

  // Sort each genre's shows by rating descending, nulls last
  for (const [, genreShows] of map) {
    genreShows.sort((a, b) => {
      const ra = a.rating.average
      const rb = b.rating.average
      if (ra === null && rb === null) return 0
      if (ra === null) return 1
      if (rb === null) return -1
      return rb - ra
    })
  }

  return map
})

const sortedGenres = computed(() => {
  const keys = [...genreMap.value.keys()]
  const prefs = new Set(preferredGenres.value)
  return keys.sort((a, b) => {
    const aP = prefs.has(a) ? 0 : 1
    const bP = prefs.has(b) ? 0 : 1
    if (aP !== bP) return aP - bP
    return a.localeCompare(b)
  })
})

async function loadShows() {
  if (pagesLoaded.value > 0 || loading.value) return

  loading.value = true
  error.value = null

  try {
    shows.value = await fetchPages(0, API_INITIAL_PAGES)
    pagesLoaded.value = API_INITIAL_PAGES
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load shows'
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!hasMore.value || loading.value) return

  const from = pagesLoaded.value
  const to = API_MAX_PAGES

  try {
    const more = await fetchPages(from, to)
    shows.value = [...shows.value, ...more]
    pagesLoaded.value = to
  } catch {
    // Silently fail — initial data is already visible
  }
}

/** Reset all state — for testing only */
export function _resetShowStore() {
  shows.value = []
  loading.value = false
  error.value = null
  pagesLoaded.value = 0
  preferredGenres.value = []
  hasChosenPrefs.value = false
  showGenrePicker.value = false
}

export function useShowStore() {
  return {
    shows, loading, error, hasMore, genreMap, sortedGenres,
    preferredGenres, hasChosenPrefs, showGenrePicker, setPreferredGenres,
    loadShows, loadMore,
  }
}

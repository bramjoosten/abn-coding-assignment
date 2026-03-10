/**
 * @fileoverview Singleton show store using module-scoped Vue refs. Manages
 * progressive API loading, genre grouping/sorting, and user genre preferences.
 */

import { ref, computed } from 'vue'
import { fetchPages } from '@/api/shows'
import {
  EXCLUDED_GENRES, API_INITIAL_PAGES, API_HARD_CEILING,
  API_BACKFILL_BATCH, CAROUSEL_PAGE_SIZE, PREFS_STORAGE_KEY,
} from '@/constants'
import type { Show } from '@/types/show'

const shows = ref<Show[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagesLoaded = ref(0)
const exhausted = ref(false)

const canFetchMore = computed(() => !exhausted.value && pagesLoaded.value < API_HARD_CEILING)

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

// ── Per-genre backfill ──────────────────────────────────────────────────────

let backfillPromise: Promise<void> | null = null

/**
 * Called when a genre section becomes visible and has fewer shows than
 * CAROUSEL_PAGE_SIZE. Fetches more API pages in batches until the genre
 * is filled or we hit the ceiling. Concurrent calls share the same fetch.
 */
function requestBackfill(genre: string): void {
  const genreShows = genreMap.value.get(genre)
  if (!canFetchMore.value || (genreShows && genreShows.length >= CAROUSEL_PAGE_SIZE)) return

  if (!backfillPromise) {
    backfillPromise = doBackfill(genre).finally(() => { backfillPromise = null })
  }
}

async function doBackfill(genre: string): Promise<void> {
  try {
    while (canFetchMore.value) {
      const genreShows = genreMap.value.get(genre)
      if (genreShows && genreShows.length >= CAROUSEL_PAGE_SIZE) break

      const from = pagesLoaded.value
      const to = Math.min(from + API_BACKFILL_BATCH, API_HARD_CEILING)
      const more = await fetchPages(from, to)

      if (more.length === 0) {
        exhausted.value = true
        break
      }

      shows.value = [...shows.value, ...more]
      pagesLoaded.value = to
    }
  } catch {
    // Best-effort — stop on failure
  }
}

/** Reset all state — for testing only */
export function _resetShowStore() {
  shows.value = []
  loading.value = false
  error.value = null
  pagesLoaded.value = 0
  exhausted.value = false
  preferredGenres.value = []
  hasChosenPrefs.value = false
  showGenrePicker.value = false
}

export function useShowStore() {
  return {
    shows, loading, error, canFetchMore, genreMap, sortedGenres,
    preferredGenres, hasChosenPrefs, showGenrePicker, setPreferredGenres,
    loadShows, requestBackfill,
  }
}

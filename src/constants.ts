/** @fileoverview Centralised app constants. All magic numbers and config values live here. */

// ── API ─────────────────────────────────────────────────────────────────────

export const API_BASE_URL = 'https://api.tvmaze.com'
export const API_MAX_RETRIES = 3
export const API_RETRY_DELAY_MS = 1500
export const API_INITIAL_PAGES = 1
export const API_MAX_PAGES = 4

// ── Search ──────────────────────────────────────────────────────────────────

export const DEBOUNCE_MS = 300

// ── Carousel ────────────────────────────────────────────────────────────────

export const SCROLL_THRESHOLD = 4
export const SCROLL_FRACTION = 0.75

// ── Rating thresholds ───────────────────────────────────────────────────────

export const RATING_HIGH = 8
export const RATING_MID = 6

// ── Display limits ──────────────────────────────────────────────────────────

export const MAX_CAST_MEMBERS = 20

// ── Lazy loading ────────────────────────────────────────────────────────────

export const LAZY_ROOT_MARGIN = '400px'

// ── Preferences ─────────────────────────────────────────────────────────────

export const PREFS_STORAGE_KEY = 'genre-preferences'

// ── Content filtering ───────────────────────────────────────────────────────

export const EXCLUDED_GENRES = ['Adult']

// ── External URLs ───────────────────────────────────────────────────────────

export const YOUTUBE_SEARCH_URL = 'https://www.youtube.com/results?search_query='

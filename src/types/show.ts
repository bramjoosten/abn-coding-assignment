/**
 * @fileoverview Hand-written subset of TVMaze API response shapes.
 *
 * These types are manually defined rather than auto-generated because TVMaze
 * does not publish an OpenAPI spec. Only the fields the app actually consumes
 * are typed — this keeps the contract explicit and avoids false confidence in
 * a self-maintained spec that could silently drift from the real API.
 *
 * @see https://www.tvmaze.com/api
 */

/** Image URLs provided by TVMaze in two resolutions. */
export interface ShowImage {
  medium: string | null
  original: string | null
}

/** Average user rating on a 1–10 scale. */
export interface ShowRating {
  average: number | null
}

/**
 * Core show data returned by `/shows?page={n}`.
 * Only includes fields consumed by the UI.
 */
export interface Show {
  id: number
  name: string
  genres: string[]
  rating: ShowRating
  image: ShowImage | null
  summary: string | null
  language: string | null
  premiered: string | null
  ended: string | null
  status: string | null
  officialSite: string | null
  network: { name: string } | null
  runtime: number | null
}

/** Wrapper returned by `/search/shows?q={query}`. */
export interface SearchResult {
  score: number
  show: Show
}

/** Cast entry with person and character info. */
export interface CastMember {
  person: {
    id: number
    name: string
    image: ShowImage | null
  }
  character: {
    id: number
    name: string
  }
}

/** Single episode within a season. */
export interface Episode {
  id: number
  name: string
  season: number
  number: number
  airdate: string | null
  runtime: number | null
  summary: string | null
  image: ShowImage | null
}

/**
 * Extended show data returned by `/shows/{id}?embed[]=cast&embed[]=episodes`.
 * The `_embedded` object is only present when embeds are requested.
 */
export interface ShowDetail extends Show {
  _embedded?: {
    cast?: CastMember[]
    episodes?: Episode[]
  }
}

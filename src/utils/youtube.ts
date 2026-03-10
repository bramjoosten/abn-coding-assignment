/** @fileoverview Builds a YouTube search URL for finding show trailers. */

import { YOUTUBE_SEARCH_URL } from '@/constants'

export function buildTrailerUrl(showName: string): string {
  return `${YOUTUBE_SEARCH_URL}${encodeURIComponent(`${showName} trailer`)}`
}

/**
 * @fileoverview Generic API client with retry logic. Handles rate limiting
 * (HTTP 429) with exponential backoff and retries up to {@link API_MAX_RETRIES} times.
 */

import { API_BASE_URL, API_MAX_RETRIES, API_RETRY_DELAY_MS } from '@/constants'

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function apiGet<T>(path: string): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < API_MAX_RETRIES; attempt++) {
    const response = await fetch(`${API_BASE_URL}${path}`)

    if (response.ok) {
      return response.json() as Promise<T>
    }

    if (response.status === 429) {
      lastError = new Error('Rate limited')
      await delay(API_RETRY_DELAY_MS * (attempt + 1))
      continue
    }

    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  throw lastError ?? new Error('Request failed')
}

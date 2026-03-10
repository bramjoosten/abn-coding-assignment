/**
 * @fileoverview Composable for fetching a single show with embedded cast and
 * episodes. Computes a season map and cast list from the API response.
 */

import { ref, computed, watch } from 'vue'
import { fetchShowById } from '@/api/shows'
import type { ShowDetail, Episode } from '@/types/show'

export function useShowDetail(id: () => number) {
  const show = ref<ShowDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const seasonMap = computed(() => {
    const episodes = show.value?._embedded?.episodes
    if (!episodes) return new Map<number, Episode[]>()

    const map = new Map<number, Episode[]>()
    for (const ep of episodes) {
      if (!map.has(ep.season)) map.set(ep.season, [])
      map.get(ep.season)!.push(ep)
    }
    return map
  })

  const cast = computed(() => show.value?._embedded?.cast ?? [])

  async function load(showId: number) {
    loading.value = true
    error.value = null
    show.value = null

    try {
      show.value = await fetchShowById(showId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load show'
    } finally {
      loading.value = false
    }
  }

  watch(id, (newId) => load(newId), { immediate: true })

  return { show, loading, error, seasonMap, cast, retry: () => load(id()) }
}

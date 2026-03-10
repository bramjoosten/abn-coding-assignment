/**
 * @fileoverview Composable for debounced show search. Watches a reactive query
 * getter and calls the TVMaze search API with a {@link DEBOUNCE_MS} delay.
 */

import { ref, watch } from 'vue'
import { searchShows } from '@/api/shows'
import { debounce } from '@/utils/debounce'
import { DEBOUNCE_MS } from '@/constants'
import type { Show } from '@/types/show'

export function useSearch(query: () => string) {
  const results = ref<Show[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searched = ref(false)

  async function doSearch(q: string) {
    if (!q.trim()) {
      results.value = []
      searched.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await searchShows(q)
      results.value = data.map((r) => r.show)
      searched.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Search failed'
    } finally {
      loading.value = false
    }
  }

  const debouncedSearch = debounce(doSearch, DEBOUNCE_MS)

  watch(query, (q) => {
    if (q.trim()) {
      loading.value = true
      debouncedSearch(q)
    } else {
      doSearch(q)
    }
  }, { immediate: true })

  return { results, loading, error, searched }
}

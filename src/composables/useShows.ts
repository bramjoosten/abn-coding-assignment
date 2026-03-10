/**
 * @fileoverview Composable that wraps the show store for use in components.
 * Triggers initial data load on mount and exposes store state and actions.
 */

import { onMounted } from 'vue'
import { useShowStore } from '@/stores/showStore'

export function useShows() {
  const {
    loading, error, hasMore, genreMap, sortedGenres,
    preferredGenres, hasChosenPrefs, showGenrePicker, setPreferredGenres,
    loadShows, loadMore,
  } = useShowStore()

  onMounted(() => {
    loadShows()
  })

  return {
    loading, error, hasMore, genreMap, sortedGenres,
    preferredGenres, hasChosenPrefs, showGenrePicker, setPreferredGenres,
    retry: loadShows, loadMore,
  }
}

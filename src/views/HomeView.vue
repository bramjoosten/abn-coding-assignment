<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted } from 'vue'
import { useShows } from '@/composables/useShows'
import GenreSection from '@/components/show/GenreSection.vue'
import LazySection from '@/components/ui/LazySection.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import GenrePickerModal from '@/components/ui/GenrePickerModal.vue'

const {
  loading, error, hasMore, genreMap, sortedGenres,
  hasChosenPrefs, preferredGenres, showGenrePicker, setPreferredGenres,
  retry, loadMore,
} = useShows()

// Show picker after initial data loads if user hasn't chosen yet
let stopWatch: (() => void) | null = null
stopWatch = watch(loading, (isLoading) => {
  if (!isLoading && !hasChosenPrefs.value && sortedGenres.value.length > 0) {
    showGenrePicker.value = true
    stopWatch?.()
    stopWatch = null
  }
})

function onSavePreferences(genres: string[]) {
  setPreferredGenres(genres)
  showGenrePicker.value = false
}

// Load remaining API pages when the scroll sentinel becomes visible
const sentinel = ref<HTMLElement | null>(null)
let sentinelObserver: IntersectionObserver | null = null

onMounted(() => {
  sentinelObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMore.value) {
        loadMore()
      }
    },
    { rootMargin: '600px' },
  )
  if (sentinel.value) sentinelObserver.observe(sentinel.value)
})

onUnmounted(() => {
  sentinelObserver?.disconnect()
})
</script>

<template>
  <main class="home">
    <!-- Genre preference picker -->
    <GenrePickerModal
      v-if="showGenrePicker"
      :genres="sortedGenres"
      :initial="preferredGenres"
      @save="onSavePreferences"
    />

    <!-- Loading skeletons -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="i in 4" :key="i" class="skeleton-row">
        <div class="skeleton-title shimmer" />
        <div class="skeleton-track">
          <SkeletonCard v-for="j in 8" :key="j" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-wrap">
      <ErrorState :message="error" @retry="retry" />
    </div>

    <!-- Genre rows -->
    <template v-else>
      <div class="page-header">
        <h1 class="page-title">Shows</h1>
        <a href="https://shelf-live-rho.vercel.app" target="_blank" rel="noopener noreferrer" class="vhs-link">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          video store experience
        </a>
      </div>

      <LazySection v-for="genre in sortedGenres" :key="genre">
        <GenreSection
          :genre="genre"
          :shows="genreMap.get(genre) ?? []"
        />
      </LazySection>

      <!-- Sentinel triggers loading remaining API pages -->
      <div ref="sentinel" class="scroll-sentinel" />
    </template>
  </main>
</template>

<style scoped>
.home {
  padding: 24px 0 48px;
}

.error-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 var(--page-padding);
  margin-bottom: 16px;
}

.page-title {
  font-size: 1.5rem;
}

.vhs-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
  transition: color var(--transition-fast);
}

.vhs-link:hover {
  color: var(--color-accent);
}

.scroll-sentinel {
  height: 1px;
}

/* ── Skeleton loading ── */

.skeleton-grid {
  padding: 0 var(--page-padding);
}

.skeleton-row {
  margin-bottom: 32px;
}

.skeleton-title {
  height: 22px;
  width: 140px;
  border-radius: 4px;
  margin-bottom: 12px;
  background: var(--color-skeleton);
}

.skeleton-track {
  display: flex;
  gap: var(--card-gap);
  overflow: hidden;
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--color-skeleton) 25%,
    var(--color-skeleton-shine) 50%,
    var(--color-skeleton) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>

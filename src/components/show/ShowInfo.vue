<script setup lang="ts">
import type { ShowDetail } from '@/types/show'
import RatingBadge from '@/components/ui/RatingBadge.vue'
import GenreTag from '@/components/ui/GenreTag.vue'
import { buildTrailerUrl } from '@/utils/youtube'

import { computed } from 'vue'

const props = defineProps<{ show: ShowDetail }>()

const youtubeUrl = computed(() => buildTrailerUrl(props.show.name))

function stripHtml(html: string | null): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}
</script>

<template>
  <div class="show-info">
    <div class="poster-col">
      <img
        v-if="show.image?.original"
        :src="show.image.original"
        :alt="show.name"
        class="poster"
      />
      <div v-else class="poster-placeholder">
        <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--color-text-dim)" stroke-width="1">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <polyline points="8 2 12 6 16 2"/>
        </svg>
      </div>
    </div>
    <div class="meta-col">
      <h1>{{ show.name }}</h1>

      <div class="meta-row">
        <RatingBadge :rating="show.rating.average" />
        <span v-if="show.premiered" class="meta-item">{{ show.premiered.slice(0, 4) }}</span>
        <span v-if="show.runtime" class="meta-item">{{ show.runtime }}min</span>
        <span v-if="show.network" class="meta-item">{{ show.network.name }}</span>
        <span v-if="show.status" class="meta-item status" :class="show.status.toLowerCase()">{{ show.status }}</span>
      </div>

      <div v-if="show.genres.length" class="genres">
        <GenreTag v-for="g in show.genres" :key="g" :genre="g" />
      </div>

      <p v-if="show.summary" class="summary">{{ stripHtml(show.summary) }}</p>

      <div class="links">
        <a v-if="show.officialSite" :href="show.officialSite" target="_blank" rel="noopener noreferrer" class="external-link">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Official site
        </a>
        <a :href="youtubeUrl" target="_blank" rel="noopener noreferrer" class="external-link youtube-link">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/>
          </svg>
          Find trailer
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-info {
  display: flex;
  gap: 32px;
  padding: 0 var(--page-padding);
}

.poster-col {
  flex-shrink: 0;
  width: 280px;
}

.poster {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card-hover);
}

.poster-placeholder {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta-col {
  flex: 1;
  min-width: 0;
}

.meta-col h1 {
  margin-bottom: 12px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.meta-item {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.status.running {
  color: var(--color-rating-high);
}

.status.ended {
  color: var(--color-text-dim);
}

.genres {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.summary {
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 640px;
  margin-bottom: 20px;
}

.links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.external-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.external-link:hover {
  color: var(--color-accent-hover);
}

.youtube-link {
  color: #ff4444;
}

.youtube-link:hover {
  color: #ff6666;
}

@media (max-width: 768px) {
  .show-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .poster-col {
    width: 200px;
  }

  .meta-row,
  .genres {
    justify-content: center;
  }

  .summary {
    text-align: left;
  }
}
</style>

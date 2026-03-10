<script setup lang="ts">
import type { Show } from '@/types/show'
import RatingBadge from '@/components/ui/RatingBadge.vue'
import { buildTrailerUrl } from '@/utils/youtube'

const props = defineProps<{ show: Show }>()

function openTrailer(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  window.open(buildTrailerUrl(props.show.name), '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <router-link :to="`/shows/${show.id}`" class="show-card">
    <div class="poster-wrap">
      <img
        v-if="show.image?.medium"
        :src="show.image.medium"
        :alt="show.name"
        class="poster"
        loading="lazy"
      />
      <div v-else class="poster-placeholder">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--color-text-dim)" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <polyline points="8 2 12 6 16 2"/>
        </svg>
      </div>
      <button class="trailer-btn" aria-label="Find trailer on YouTube" @click="openTrailer">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/>
        </svg>
        Trailer
      </button>
    </div>
    <div class="card-info">
      <h3 class="show-name">{{ show.name }}</h3>
      <RatingBadge :rating="show.rating.average" />
    </div>
  </router-link>
</template>

<style scoped>
.show-card {
  display: block;
  width: var(--card-width);
  flex-shrink: 0;
  transition: transform var(--transition-fast);
}

.show-card:hover {
  transform: translateY(-4px);
}

.poster-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-fast);
}

.show-card:hover .poster-wrap {
  box-shadow: var(--shadow-card-hover);
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
}

/* ── Trailer hover button (desktop only) ── */

.trailer-btn {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 100px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  color: #ff4444;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--transition-fast), transform var(--transition-fast), background var(--transition-fast);
  white-space: nowrap;
}

@media (hover: hover) {
  .poster-wrap:hover .trailer-btn {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.trailer-btn:hover {
  background: rgba(0, 0, 0, 0.95);
}

@media (hover: none) {
  .trailer-btn {
    display: none;
  }
}

/* ── Card info ── */

.card-info {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.show-name {
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

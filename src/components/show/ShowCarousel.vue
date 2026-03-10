<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import type { Show } from '@/types/show'
import ShowCard from './ShowCard.vue'
import { SCROLL_THRESHOLD, SCROLL_FRACTION, CAROUSEL_PAGE_SIZE } from '@/constants'

const props = defineProps<{ shows: Show[] }>()

const visibleCount = ref(CAROUSEL_PAGE_SIZE)
const visibleShows = computed(() => props.shows.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < props.shows.length)
const remaining = computed(() => Math.min(CAROUSEL_PAGE_SIZE, props.shows.length - visibleCount.value))

async function showMore() {
  if (!track.value) {
    visibleCount.value += CAROUSEL_PAGE_SIZE
    return
  }
  const scrollPos = track.value.scrollLeft
  // Temporarily disable scroll-snap so the browser doesn't snap back
  track.value.style.scrollSnapType = 'none'
  visibleCount.value += CAROUSEL_PAGE_SIZE
  await nextTick()
  track.value.scrollLeft = scrollPos
  // Re-enable scroll-snap after layout settles
  requestAnimationFrame(() => {
    if (track.value) track.value.style.scrollSnapType = ''
  })
}

const track = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

let rafId = 0
function updateScrollState() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    if (!track.value) return
    const { scrollLeft, scrollWidth, clientWidth } = track.value
    const left = scrollLeft > SCROLL_THRESHOLD
    const right = scrollLeft + clientWidth < scrollWidth - SCROLL_THRESHOLD
    if (canScrollLeft.value !== left) canScrollLeft.value = left
    if (canScrollRight.value !== right) canScrollRight.value = right
  })
}

function scroll(direction: 'left' | 'right') {
  if (!track.value) return
  const amount = track.value.clientWidth * SCROLL_FRACTION
  track.value.scrollBy({
    left: direction === 'left' ? -amount : amount,
    behavior: 'smooth',
  })
}

let trackEl: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  trackEl = track.value
  if (trackEl) {
    trackEl.addEventListener('scroll', updateScrollState, { passive: true })
    resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(trackEl)
    updateScrollState()
  }
})

onUnmounted(() => {
  trackEl?.removeEventListener('scroll', updateScrollState)
  resizeObserver?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="carousel">
    <button
      v-show="canScrollLeft"
      class="scroll-btn scroll-btn--left"
      aria-label="Scroll left"
      @click="scroll('left')"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <div ref="track" class="carousel-track">
      <ShowCard v-for="show in visibleShows" :key="show.id" :show="show" />
      <button v-if="hasMore" class="show-more-btn" @click="showMore">
        <span class="show-more-count">+{{ remaining }}</span>
        <span class="show-more-label">show more</span>
      </button>
    </div>

    <button
      v-show="canScrollRight"
      class="scroll-btn scroll-btn--right"
      aria-label="Scroll right"
      @click="scroll('right')"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 6 15 12 9 18" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
}

.carousel-track {
  display: flex;
  gap: var(--card-gap);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: var(--page-padding);
  padding: 8px var(--page-padding) 16px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-track > * {
  scroll-snap-align: start;
}

/* ── Scroll buttons ── */

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(calc(-50% - 12px));
  z-index: 2;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.9);
  color: var(--color-text);
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background var(--transition-fast), opacity var(--transition-normal);
  opacity: 0;
}

.carousel:hover .scroll-btn {
  opacity: 0.85;
}

.scroll-btn:hover {
  background: var(--color-surface-hover);
  opacity: 1;
}

@media (hover: none) {
  .scroll-btn {
    display: none;
  }
}

.scroll-btn--left {
  left: 6px;
}

.scroll-btn--right {
  right: 6px;
}

/* ── Show more button ── */

.show-more-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: var(--card-width, 160px);
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-dim);
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.show-more-btn:hover {
  border-color: var(--color-text-dim);
  color: var(--color-text);
}

.show-more-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
}

.show-more-label {
  font-size: 0.8125rem;
  font-weight: 600;
}
</style>

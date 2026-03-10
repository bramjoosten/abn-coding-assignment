<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Show } from '@/types/show'
import ShowCard from './ShowCard.vue'
import { SCROLL_THRESHOLD, SCROLL_FRACTION } from '@/constants'

defineProps<{ shows: Show[] }>()

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
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
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
</style>

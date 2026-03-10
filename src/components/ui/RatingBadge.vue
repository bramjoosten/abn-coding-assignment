<script setup lang="ts">
import { RATING_HIGH, RATING_MID } from '@/constants'

const props = defineProps<{ rating: number | null }>()

function ratingColor(r: number | null): string {
  if (r === null) return 'var(--color-text-dim)'
  if (r >= RATING_HIGH) return 'var(--color-rating-high)'
  if (r >= RATING_MID) return 'var(--color-rating-mid)'
  return 'var(--color-rating-low)'
}
</script>

<template>
  <span class="rating-badge" :style="{ '--badge-color': ratingColor(props.rating) }">
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
    <span v-if="props.rating !== null">{{ props.rating.toFixed(1) }}</span>
    <span v-else class="na">N/A</span>
  </span>
</template>

<style scoped>
.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--badge-color);
  font-size: 0.8125rem;
  font-weight: 600;
}

.na {
  color: var(--color-text-dim);
  font-weight: 400;
}
</style>

<script setup lang="ts">
import type { Show } from '@/types/show'
import ShowCarousel from './ShowCarousel.vue'

defineProps<{ genre: string; shows: Show[] }>()
</script>

<template>
  <section class="genre-section">
    <h2 class="genre-title">{{ genre }}</h2>
    <ShowCarousel :shows="shows" />
  </section>
</template>

<style scoped>
.genre-section {
  margin-bottom: 24px;
}

.genre-title {
  padding: 0 var(--page-padding);
  margin-bottom: 6px;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { Show } from '@/types/show'
import ShowCarousel from './ShowCarousel.vue'
import { useShowStore } from '@/stores/showStore'
import { CAROUSEL_PAGE_SIZE } from '@/constants'

const props = defineProps<{ genre: string; shows: Show[] }>()
const { requestBackfill } = useShowStore()

onMounted(() => {
  if (props.shows.length < CAROUSEL_PAGE_SIZE) {
    requestBackfill(props.genre)
  }
})
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

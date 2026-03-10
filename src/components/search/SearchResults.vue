<script setup lang="ts">
import type { Show } from '@/types/show'
import ShowCard from '@/components/show/ShowCard.vue'

defineProps<{ shows: Show[] }>()
</script>

<template>
  <div class="search-results">
    <ShowCard v-for="show in shows" :key="show.id" :show="show" />
  </div>
</template>

<style scoped>
.search-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--card-width), 1fr));
  gap: var(--card-gap);
  padding: 0 var(--page-padding);
}

.search-results :deep(.show-card) {
  width: 100%;
}
</style>

<script setup lang="ts">
import type { Episode } from '@/types/show'
import AppDisclosure from '@/components/ui/AppDisclosure.vue'

const props = defineProps<{ seasonMap: Map<number, Episode[]> }>()
</script>

<template>
  <section v-if="props.seasonMap.size" class="episodes-section">
    <h2>Episodes</h2>
    <div class="season-list">
      <AppDisclosure
        v-for="[season, episodes] in props.seasonMap"
        :key="season"
        :label="`Season ${season}`"
        :detail="`${episodes.length} episodes`"
        :open="season === 1"
      >
        <div v-for="ep in episodes" :key="ep.id" class="episode-row">
          <span class="ep-number">E{{ String(ep.number).padStart(2, '0') }}</span>
          <span class="ep-name">{{ ep.name }}</span>
          <span v-if="ep.airdate" class="ep-date">{{ ep.airdate }}</span>
          <span v-if="ep.runtime" class="ep-runtime">{{ ep.runtime }}m</span>
        </div>
      </AppDisclosure>
    </div>
  </section>
</template>

<style scoped>
.episodes-section {
  padding: 0 var(--page-padding);
}

.episodes-section h2 {
  margin-bottom: 16px;
}

.season-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.episode-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  font-size: 0.875rem;
  transition: background var(--transition-fast);
}

.episode-row:hover {
  background: var(--color-surface-hover);
}

.ep-number {
  color: var(--color-text-dim);
  font-weight: 500;
  width: 32px;
  flex-shrink: 0;
}

.ep-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ep-date,
.ep-runtime {
  color: var(--color-text-dim);
  font-size: 0.75rem;
  flex-shrink: 0;
}
</style>

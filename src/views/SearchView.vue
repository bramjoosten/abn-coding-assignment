<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSearch } from '@/composables/useSearch'
import SearchResults from '@/components/search/SearchResults.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()
const query = computed(() => (route.query.q as string) || '')
const { results, loading, error, searched } = useSearch(() => query.value)
</script>

<template>
  <main class="search-view">
    <h1 v-if="query" class="search-heading">
      Results for <span class="query">"{{ query }}"</span>
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner" />
    </div>

    <!-- Error -->
    <ErrorState v-else-if="error" :message="error" @retry="() => {}" />

    <!-- Results -->
    <SearchResults v-else-if="results.length" :shows="results" />

    <!-- Empty state -->
    <div v-else-if="searched" class="empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--color-text-dim)" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p>No shows found for "{{ query }}"</p>
    </div>

    <!-- Initial state -->
    <div v-else class="empty-state">
      <p>Type a show name to search</p>
    </div>
  </main>
</template>

<style scoped>
.search-view {
  padding: 24px 0;
}

.search-heading {
  padding: 0 var(--page-padding);
  margin-bottom: 24px;
  font-weight: 400;
}

.query {
  font-weight: 700;
  color: var(--color-accent);
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 24px;
  color: var(--color-text-dim);
}
</style>

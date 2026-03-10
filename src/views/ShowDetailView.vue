<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShowDetail } from '@/composables/useShowDetail'
import ShowInfo from '@/components/show/ShowInfo.vue'
import CastList from '@/components/show/CastList.vue'
import EpisodeList from '@/components/show/EpisodeList.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import AppButton from '@/components/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()

const showId = computed(() => Number(route.params.id))
const { show, loading, error, seasonMap, cast, retry } = useShowDetail(() => showId.value)
</script>

<template>
  <main class="detail">
    <AppButton variant="info" size="sm" class="back-button" @click="router.back()">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
      Back
    </AppButton>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner" />
    </div>

    <!-- Error -->
    <ErrorState v-else-if="error" :message="error" @retry="retry" />

    <!-- Content -->
    <template v-else-if="show">
      <ShowInfo :show="show" />
      <CastList :cast="cast" />
      <EpisodeList :season-map="seasonMap" />
    </template>
  </main>
</template>

<style scoped>
.detail {
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.back-button {
  margin: 0 var(--page-padding);
  align-self: flex-start;
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
</style>

<script setup lang="ts">
import type { CastMember } from '@/types/show'
import { MAX_CAST_MEMBERS } from '@/constants'

defineProps<{ cast: CastMember[] }>()
</script>

<template>
  <section v-if="cast.length" class="cast-section">
    <h2>Cast</h2>
    <div class="cast-grid">
      <div v-for="member in cast.slice(0, MAX_CAST_MEMBERS)" :key="member.person.id" class="cast-card">
        <img
          v-if="member.person.image?.medium"
          :src="member.person.image.medium"
          :alt="member.person.name"
          class="cast-photo"
          loading="lazy"
        />
        <div v-else class="cast-photo-placeholder">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--color-text-dim)" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="cast-info">
          <p class="cast-name">{{ member.person.name }}</p>
          <p class="cast-character">{{ member.character.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cast-section {
  padding: 0 var(--page-padding);
}

.cast-section h2 {
  margin-bottom: 16px;
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.cast-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.cast-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.cast-photo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-skeleton);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cast-info {
  min-width: 0;
}

.cast-name {
  font-size: 0.875rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cast-character {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

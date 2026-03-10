<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from '@/utils/debounce'
import { DEBOUNCE_MS } from '@/constants'

const router = useRouter()
const route = useRoute()
const query = ref((route.query.q as string) || '')

// Sync input when route changes (e.g. browser back/forward)
watch(() => route.query.q, (q) => {
  query.value = (q as string) || ''
})

const navigate = debounce((q: string) => {
  if (q) {
    router.push({ name: 'search', query: { q } })
  }
}, DEBOUNCE_MS)

function onInput() {
  const q = query.value.trim()
  if (q) {
    navigate(q)
  }
}

function onSubmit() {
  const q = query.value.trim()
  if (q) {
    router.push({ name: 'search', query: { q } })
  }
}

function clear() {
  query.value = ''
  if (route.name === 'search') {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <form class="search-bar" @submit.prevent="onSubmit" role="search">
    <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
    <input
      v-model="query"
      type="search"
      placeholder="Search shows..."
      aria-label="Search TV shows"
      @input="onInput"
    />
    <button
      v-if="query"
      type="button"
      class="clear-btn"
      aria-label="Clear search"
      @click="clear"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </form>
</template>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 360px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-dim);
  pointer-events: none;
}

input {
  width: 100%;
  padding: 10px 36px 10px 40px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

input::placeholder {
  color: var(--color-text-dim);
}

input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(255, 210, 0, 0.15);
}

/* Remove webkit search cancel button */
input::-webkit-search-cancel-button {
  display: none;
}

.clear-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--color-text-dim);
  cursor: pointer;
  transition: color var(--transition-fast), background var(--transition-fast);
}

.clear-btn:hover {
  color: var(--color-text);
  background: var(--color-border);
}
</style>

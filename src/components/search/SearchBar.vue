<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce'
import { DEBOUNCE_MS } from '@/constants'

const router = useRouter()
const query = ref('')

const navigate = debounce((q: string) => {
  if (q.trim()) {
    router.push({ name: 'search', query: { q: q.trim() } })
  }
}, DEBOUNCE_MS)

function onInput() {
  navigate(query.value)
}

function onSubmit() {
  if (query.value.trim()) {
    router.push({ name: 'search', query: { q: query.value.trim() } })
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
  padding: 10px 16px 10px 40px;
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
</style>

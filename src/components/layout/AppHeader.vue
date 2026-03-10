<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '@/components/search/SearchBar.vue'
import { useShowStore } from '@/stores/showStore'

const route = useRoute()
const { preferredGenres, showGenrePicker } = useShowStore()

const isHome = computed(() => route.name === 'home')

// ── Scroll-hide ─────────────────────────────────────────────────────────────

let lastScrollY = 0
const headerHidden = ref(false)

function onScroll() {
  const y = window.scrollY
  headerHidden.value = y > lastScrollY && y > 64
  lastScrollY = y
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="app-header" :class="{ hidden: headerHidden }">
    <div class="header-inner">
      <router-link to="/" class="logo" aria-label="Home">
        <svg class="logo-icon" viewBox="0 0 24 24" width="28" height="28">
          <rect class="tv-screen" x="4" y="8.5" width="16" height="11" rx="1" />
          <rect x="2" y="7" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <polyline points="8 2 12 6 16 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">Bram's coding assignment</span>
      </router-link>

      <div class="spacer" />

      <div class="end-group">
        <SearchBar />
        <button
          v-if="isHome"
          class="filter-btn"
          aria-label="Filter genres"
          @click="showGenrePicker = true"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="7" y1="12" x2="17" y2="12"/>
            <line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
          <span v-if="preferredGenres.length" class="filter-count">{{ preferredGenres.length }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.app-header.hidden {
  transform: translateY(-100%);
}

.header-inner {
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 0 var(--page-padding);
}

/* ── Logo ── */

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  flex-shrink: 0;
  margin: -8px;
  padding: 8px;
  margin-left: calc(-1 * var(--page-padding));
  padding-left: var(--page-padding);
}

.logo-text {
  display: none;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-text);
}

.tv-screen {
  fill: transparent;
  transition: fill var(--transition-fast);
}

.logo:hover .tv-screen {
  fill: var(--color-accent);
}

/* ── End group ── */

.end-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.spacer {
  display: none;
}

/* ── Filter button ── */

.filter-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--min-tap-target);
  height: var(--min-tap-target);
  border-radius: var(--radius-md);
  background: none;
  border: none;
  color: var(--color-text-dim);
  cursor: pointer;
  transition: color var(--transition-fast), background var(--transition-fast);
}

.filter-btn:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

.filter-count {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  background: var(--color-accent);
  color: #1a1a1a;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0 4px;
}

@media (min-width: 481px) {
  .logo-text {
    display: inline;
  }
}

@media (min-width: 769px) {
  .header-inner {
    grid-template-columns: 1fr auto 1fr;
    gap: 24px;
  }

  .logo-text {
    font-size: 1.0625rem;
  }

  .spacer {
    display: block;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GenreTag from './GenreTag.vue'
import AppButton from './AppButton.vue'

const props = defineProps<{
  genres: string[]
  initial?: string[]
}>()

const emit = defineEmits<{ save: [genres: string[]] }>()

const selected = ref<Set<string>>(new Set(props.initial ?? []))

function toggle(genre: string) {
  if (selected.value.has(genre)) {
    selected.value.delete(genre)
  } else {
    selected.value.add(genre)
  }
  selected.value = new Set(selected.value)
}

function clearAll() {
  selected.value = new Set()
}

function save() {
  emit('save', [...selected.value])
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') save()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="modal-backdrop" @click.self="save">
    <div class="modal" role="dialog" aria-label="Pick your favorite genres">
      <button class="close-btn" aria-label="Close" @click="save">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <h2>What do you like to watch?</h2>
      <p class="subtitle">Pick your favorite genres to see them first. You can skip this.</p>

      <div class="genre-grid">
        <button
          v-for="genre in props.genres"
          :key="genre"
          class="genre-option"
          :class="{ active: selected.has(genre) }"
          @click="toggle(genre)"
        >
          <GenreTag :genre="genre" />
        </button>
      </div>

      <div class="actions">
        <button v-if="selected.size > 0" class="clear-all" @click="clearAll">clear all</button>
        <AppButton variant="primary" @click="save">
          {{ selected.size > 0 ? "Let's go!" : 'Skip' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: 24px;
}

.modal {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 32px;
  max-width: 480px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
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
  transition: color var(--transition-fast);
}

.close-btn:hover {
  color: var(--color-text);
}

.modal h2 {
  margin-bottom: 4px;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-bottom: 24px;
}

.genre-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.genre-option {
  cursor: pointer;
  border-radius: 100px;
  border: 2px solid transparent;
  padding: 0;
  background: none;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.genre-option:hover {
  transform: scale(1.05);
}

.genre-option.active {
  border-color: var(--color-accent);
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.clear-all {
  background: none;
  border: none;
  color: var(--color-text-dim);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 0;
  transition: color var(--transition-fast);
}

.clear-all:hover {
  color: var(--color-text);
}
</style>

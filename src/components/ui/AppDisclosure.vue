<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  detail?: string
  open?: boolean
}>()

const isOpen = ref(props.open ?? false)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="disclosure">
    <button class="disclosure-header" @click="toggle">
      <span class="disclosure-label">{{ label }}</span>
      <span v-if="detail" class="disclosure-detail">{{ detail }}</span>
      <svg
        class="disclosure-chevron"
        :class="{ open: isOpen }"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <div v-if="isOpen" class="disclosure-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.disclosure {
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
}

.disclosure-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.disclosure-header:hover {
  background: var(--color-surface-hover);
}

.disclosure-detail {
  color: var(--color-text-dim);
  font-weight: 400;
  font-size: 0.8125rem;
}

.disclosure-chevron {
  margin-left: auto;
  color: var(--color-text-dim);
  transition: transform var(--transition-fast);
}

.disclosure-chevron.open {
  transform: rotate(180deg);
}

.disclosure-content {
  border-top: 1px solid var(--color-border);
}
</style>

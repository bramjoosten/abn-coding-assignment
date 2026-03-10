<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <button class="app-btn" :class="[variant ?? 'info', size ?? 'md']">
    <slot />
  </button>
</template>

<style scoped>
.app-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  white-space: nowrap;
}

/* ── Sizes ── */

.md {
  padding: 10px 24px;
  font-size: 0.875rem;
}

.sm {
  padding: 6px 14px;
  font-size: 0.8125rem;
}

/* ── Variants ── */

.primary {
  background: var(--color-text);
  color: var(--color-bg);
  border: none;
}

.primary:hover {
  background: color-mix(in srgb, var(--color-text) 85%, var(--color-bg));
}

.info {
  background: color-mix(in srgb, var(--color-text-muted) 18%, var(--color-bg));
  color: var(--color-text);
  border: none;
}

.info:hover {
  background: color-mix(in srgb, var(--color-text-muted) 28%, var(--color-bg));
}

.success {
  background: color-mix(in srgb, var(--color-rating-high) 18%, var(--color-bg));
  color: var(--color-rating-high);
  border: none;
}

.success:hover {
  background: color-mix(in srgb, var(--color-rating-high) 28%, var(--color-bg));
}

.warning {
  background: color-mix(in srgb, var(--color-rating-mid) 18%, var(--color-bg));
  color: var(--color-rating-mid);
  border: none;
}

.warning:hover {
  background: color-mix(in srgb, var(--color-rating-mid) 28%, var(--color-bg));
}

.error {
  background: color-mix(in srgb, var(--color-rating-low) 18%, var(--color-bg));
  color: var(--color-rating-low);
  border: none;
}

.error:hover {
  background: color-mix(in srgb, var(--color-rating-low) 28%, var(--color-bg));
}
</style>

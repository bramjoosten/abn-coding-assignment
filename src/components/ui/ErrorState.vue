<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'

defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-state">
    <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--color-accent)" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <p class="error-message">{{ message }}</p>
    <AppButton variant="error" @click="emit('retry')">Try again</AppButton>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
}

.error-message {
  color: var(--color-text-muted);
  max-width: 400px;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { LAZY_ROOT_MARGIN } from '@/constants'

const emit = defineEmits<{ visible: [] }>()

const root = ref<HTMLElement | null>(null)
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!root.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        emit('visible')
        observer?.disconnect()
      }
    },
    { rootMargin: LAZY_ROOT_MARGIN },
  )
  observer.observe(root.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="root">
    <slot v-if="visible" />
    <div v-else class="lazy-placeholder" />
  </div>
</template>

<style scoped>
.lazy-placeholder {
  height: 220px;
}
</style>

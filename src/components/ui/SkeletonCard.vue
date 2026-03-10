<template>
  <div class="skeleton-card">
    <div class="skeleton-poster shimmer" />
    <div class="skeleton-text shimmer" />
    <div class="skeleton-text short shimmer" />
  </div>
</template>

<style scoped>
.skeleton-card {
  width: var(--card-width);
  flex-shrink: 0;
}

.skeleton-poster {
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--radius-md);
  background: var(--color-skeleton);
}

.skeleton-text {
  height: 14px;
  margin-top: 10px;
  border-radius: 4px;
  background: var(--color-skeleton);
}

.skeleton-text.short {
  width: 60%;
  height: 12px;
  margin-top: 6px;
}

.shimmer {
  background: linear-gradient(
    90deg,
    var(--color-skeleton) 25%,
    var(--color-skeleton-shine) 50%,
    var(--color-skeleton) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>

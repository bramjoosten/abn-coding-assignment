<template>
  <footer class="app-footer">
    <p>
      Data provided by
      <a href="https://www.tvmaze.com" target="_blank" rel="noopener noreferrer">TVMaze</a>
    </p>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: auto;
  padding: 24px var(--page-padding);
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-text-dim);
  border-top: 1px solid var(--color-border);
}

.app-footer a {
  color: var(--color-accent);
  transition: color var(--transition-fast);
}

.app-footer a:hover {
  color: var(--color-accent-hover);
}
</style>

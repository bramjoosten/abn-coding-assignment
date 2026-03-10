<script setup lang="ts">
const props = defineProps<{ genre: string }>()

const GENRE_COLORS: Record<string, string> = {
  Drama: '#7b68ee',
  Comedy: '#f0c929',
  Action: '#e94560',
  Crime: '#ff8c42',
  Thriller: '#c74b50',
  Science_Fiction: '#00d2ff',
  'Science-Fiction': '#00d2ff',
  Horror: '#e23c3c',
  Romance: '#ff6b81',
  Adventure: '#4ecb71',
  Fantasy: '#9b59b6',
  Mystery: '#4a69bd',
  Family: '#82ccdd',
  Anime: '#ff6348',
  Music: '#e056fd',
  War: '#a0aec0',
  History: '#b8860b',
  Western: '#d4a76a',
  Sports: '#20bf6b',
  Medical: '#0abde3',
  Legal: '#778beb',
  Espionage: '#a4b0be',
  Supernatural: '#6c5ce7',
  Nature: '#10ac84',
  Children: '#ffd32a',
  Food: '#ff9f43',
}

function getColor(genre: string): string {
  if (GENRE_COLORS[genre]) return GENRE_COLORS[genre]
  // Deterministic fallback from genre name
  let hash = 0
  for (let i = 0; i < genre.length; i++) {
    hash = genre.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 60%, 55%)`
}
</script>

<template>
  <span class="genre-tag" :style="{ '--tag-color': getColor(props.genre) }">
    {{ props.genre }}
  </span>
</template>

<style scoped>
.genre-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  background: color-mix(in srgb, var(--tag-color) 18%, var(--color-bg));
  color: var(--tag-color);
  white-space: nowrap;
}
</style>

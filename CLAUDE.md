# TV Show Dashboard — ABN Coding Assignment

> **Important:** Always read `ARCHITECTURE.md` at the start of every task. It contains architectural decisions, accessibility requirements, and design constraints that must be followed.

## Stack
- Vue 3 (Composition API, `<script setup>`) + TypeScript
- Module-scoped refs for state (no external state library)
- Vue Router (history mode)
- Custom build system: `dev.ts` (esbuild + Vue SFC compiler)
- Vitest + jsdom for testing
- pnpm as package manager

## Commands
- `pnpm dev` — Start dev server on http://localhost:5173 (only script in package.json)
- `tsx tools/dev.ts build` — Production build to `dist/`
- `tsx tools/dev.ts test` — Run tests with Vitest
- `tsx tools/dev.ts typecheck` — Type-check with vue-tsc
- `tsx tools/dev.ts ci` — Full pipeline: typecheck → test → build

## Project Structure
```
src/
  main.ts                    — App entry point
  App.vue                    — Root component (header + router-view + footer)
  assets/styles/             — Global CSS (variables, reset, typography, transitions)
  components/
    layout/                  — AppHeader, AppFooter
    search/                  — SearchBar, SearchResults
    show/                    — ShowCard, ShowCarousel, GenreSection, ShowInfo, CastList, EpisodeList
    ui/                      — RatingBadge, GenreTag, SkeletonCard, ErrorState
  composables/               — useShows, useShowDetail, useSearch
  stores/                    — showStore (module-scoped refs)
  api/                       — client.ts (base fetch), shows.ts (TVMaze API)
  views/                     — HomeView, ShowDetailView, SearchView
  types/                     — show.ts
  __tests__/                 — Unit tests (mirrors src structure)
```

## Architecture
- Data from TVMaze API (http://api.tvmaze.com)
- Home page groups shows by genre in horizontal carousels, sorted by rating
- Show detail page at `/shows/:id`
- Search at `/search?q=...` with debounced input
- CSS variables for theming in `_variables.css`
- Path alias: `@` → `src/`

## Conventions
- Scoped styles in Vue SFCs
- Components use PascalCase filenames
- Composables prefixed with `use`
- Tests in `src/__tests__/` with `.spec.ts` extension

# Architecture

## Why These Choices?

### Custom esbuild instead of Vite

Vite is the default for Vue projects, but it's a black box. This project uses a custom esbuild pipeline with a hand-written Vue SFC plugin. It compiles `<script setup>`, `<template>`, and `<style scoped>` directly, giving full control over how components are built. The tradeoff is more setup work, but the result is a build system with no magic — every step is visible and debuggable.

### No state library

Pinia is the standard for Vue state management, but with a single store it adds ceremony without value. Instead, the store is plain Vue `ref`/`computed` values at module scope — a singleton by nature of ES modules. It's reactive, type-safe, and tree-shakeable without any library overhead.

### Progressive loading over bulk fetching

The TVMaze API has no per-genre endpoint, so we have to fetch paginated lists of all shows and group them ourselves. Loading everything upfront would block the initial render. Instead:

1. Fetch 1 page (~64 shows) on mount — enough to fill the visible swimlanes immediately
2. When a genre has fewer than 20 shows, a background backfill fetches more pages until it's full or the API is exhausted
3. Each swimlane caps at 20 visible items with a "show more" button

This keeps first paint fast while ensuring every genre has enough content.

### Lazy rendering with IntersectionObserver

The home page can have 20+ genre swimlanes. Rendering all of them on mount is wasteful — most are off-screen. Each swimlane is wrapped in a `LazySection` that only renders its content when it enters a 400px buffer zone around the viewport. Once visible, it stays mounted.

### Mobile-first CSS

All styles are written for the smallest viewport first. Larger screens are handled with `@media (min-width: ...)` only — `max-width` queries are not permitted. This forces you to think about the constrained case first and layer on enhancements, rather than stripping things away.

Three breakpoints:

| Viewport | Trigger | Padding | Card width | Header |
|----------|---------|---------|------------|--------|
| Mobile | default | 12px | 120px | 56px |
| Tablet | `min-width: 481px` | 16px | 140px | 56px |
| Desktop | `min-width: 769px` | 24px | 180px | 64px |

### Hand-written types over code generation

TVMaze doesn't publish an OpenAPI spec. Rather than maintaining our own spec file that could silently drift from the real API, the types in `src/types/show.ts` are hand-written to cover only the fields the app actually uses. If TVMaze ever publishes a spec, we'd switch to `openapi-typescript`.

### History mode routing

URLs like `/shows/123` instead of `/#/shows/123`. Cleaner, shareable, and SEO-friendly. Search uses query params (`/search?q=term`) so results are bookmarkable.

### Genre preferences in localStorage

No backend needed. On first visit a modal asks for favorite genres (skippable). Preferences persist across sessions and float preferred genres to the top of the home page.

### Documentation: Storybook + inline JSDoc

Two systems, zero generated sites. Vue components are documented through Storybook autodocs — stories *are* the documentation. TypeScript files use `@fileoverview` JSDoc blocks, enforced by CI. For a project this size, a generated TypeDoc site would add build steps and hosting for content that's already one click away in the editor.

---

## UX Patterns

### Search

Debounced search-as-you-type navigates to `/search?q=...`. Route query params make searches bookmarkable. Clear button returns home. Back/forward navigation syncs the input.

### Loading & Errors

Skeleton screens with shimmer for initial load. Spinners for detail/search. Error state with retry button.

### Modals

Close button (top-right, 44px target), Escape key, and backdrop click all dismiss.

### Accessibility

- Every view has an `<h1>` for screen readers
- 44x44px minimum tap targets (WCAG 2.1)
- Carousel scroll buttons hidden on touch devices
- Off-screen images use `loading="lazy"`

### Styling

- Dark color scheme: black background, teal surfaces, yellow accent (`#ffd200`)
- Genre colors are hardcoded with a deterministic HSL fallback for unknowns
- No transparent label/badge backgrounds — mix with a solid color instead

---

## Reference

### Data Flow

```
TVMaze API → apiGet<T>() → Store / Composable → Vue Component
```

### Routes

| Path | View | Description |
|------|------|-------------|
| `/` | HomeView | Genre swimlanes sorted by rating |
| `/shows/:id` | ShowDetailView | Full detail with cast and episodes |
| `/search?q=` | SearchView | Search results grid |

### Component Tree

```
App.vue
├── AppHeader (sticky, logo + SearchBar + filter button)
├── <router-view>
│   ├── HomeView
│   │   ├── GenreSection → ShowCarousel → ShowCard[]
│   │   └── SkeletonCard[] (loading)
│   ├── ShowDetailView
│   │   ├── ShowInfo (poster, metadata, genres, summary)
│   │   ├── CastList (grid, max 20)
│   │   └── EpisodeList (collapsible seasons)
│   └── SearchView
│       └── SearchResults → ShowCard[]
└── AppFooter
```

### Component Tiers

- **Elements** (`src/components/ui/`) — single-purpose, no domain logic: RatingBadge, GenreTag, SkeletonCard, ErrorState, LazySection, GenrePickerModal, AppButton, AppDisclosure
- **Compositions** (`src/components/show/`, `search/`) — elements working together: ShowCard, ShowCarousel, GenreSection, ShowInfo, CastList, EpisodeList, SearchResults
- **Pages** (`src/views/`) — route-level views wiring compositions to data

### API Layer (`src/api/`)

- `client.ts` — `apiGet<T>(path)` with retry (3 attempts, exponential backoff, 429 handling)
- `shows.ts` — `fetchPages(from, to)`, `searchShows(query)`, `fetchShowById(id)`

### Composables (`src/composables/`)

- `useShows` — wraps store, triggers load on mount
- `useShowDetail` — fetches single show, computes season map and cast
- `useSearch` — debounced search, watches route query param

### Build System (`tools/`)

Custom esbuild pipeline with Vue SFC plugin. Tasks: `dev`, `build`, `test`, `typecheck`, `docs`, `storybook`, `ci`. Chokidar watcher selectively rebuilds on save. Tests only run when relevant files change.

### Testing (`src/__tests__/`)

API tests (mock fetch, retry logic), store tests (genre grouping/sorting), composable tests (reactivity/debounce), component tests (rendering/links). Fixtures in `src/__tests__/fixtures/shows.ts`.

### Deployment

Vercel with Build Output API v3. Edge Middleware for basic auth. `X-Robots-Tag: noindex` on all responses. SPA fallback to `index.html`. Deploy: `vercel deploy --prod`.

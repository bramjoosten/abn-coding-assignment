# Architecture

## Stack

- **Vue 3** — Composition API with `<script setup>`, TypeScript
- **Module-scoped refs** — Singleton reactive state (no external state library for now)
- **Vue Router** — History mode, lazy-loaded routes (for pretty urls)
- **esbuild** — Custom build system via `tools/dev.ts`
- **Vitest** — Unit testing with jsdom

## Data Flow

```
TVMaze API → apiGet<T>() → Store / Composable → Vue Component
```

### API Layer (`src/api/`)

- `client.ts` — Generic `apiGet<T>(path)` with retry (3 attempts, exponential backoff, 429 handling)
- `shows.ts` — Endpoints:
  - `fetchPages(from, to)` — Parallel fetch of a range of paginated show pages
  - `searchShows(query)` — `/search/shows?q=...`
  - `fetchShowById(id)` — `/shows/{id}?embed[]=cast&embed[]=episodes`

### State (`src/stores/showStore.ts`)

- Plain Vue `ref`/`computed` at module scope — singleton pattern, no state library needed
- **Progressive loading**: loads 1 page (~64 shows) on mount for fast initial render, then loads remaining pages (up to 4 total) when user scrolls near the bottom
- Groups shows by genre into `Map<string, Show[]>`, excludes "Adult"
- Sorts within each genre by rating descending (nulls last)
- Exposes: `shows`, `loading`, `error`, `hasMore`, `genreMap`, `sortedGenres`, `loadMore`

### Composables (`src/composables/`)

| Composable       | Purpose                                      | Used by         |
|------------------|----------------------------------------------|-----------------|
| `useShows`       | Wraps store, triggers load on mount           | HomeView        |
| `useShowDetail`  | Fetches single show, computes seasonMap/cast  | ShowDetailView  |
| `useSearch`      | Debounced search (300ms), watches query param | SearchView      |

### Types (`src/types/show.ts`)

- `Show` — Core show data (id, name, genres, rating, image, summary, etc.)
- `ShowDetail` — Extends Show with `_embedded?.cast` and `_embedded?.episodes`
- `SearchResult` — `{ score, show }` wrapper from search endpoint
- `CastMember` — `{ person, character }` with images
- `Episode` — Season/episode number, airdate, runtime, summary

## Routes

| Path          | View            | Description                      |
|---------------|-----------------|----------------------------------|
| `/`           | HomeView        | Genre swimlanes sorted by rating |
| `/shows/:id`  | ShowDetailView  | Full show detail with cast/episodes |
| `/search?q=`  | SearchView      | Search results grid              |

## Component Tree

```
App.vue
├── AppHeader (sticky, logo + SearchBar)
├── <router-view>
│   ├── HomeView
│   │   ├── GenreSection → ShowCarousel → ShowCard[]
│   │   └── SkeletonCard[] (loading state)
│   ├── ShowDetailView
│   │   ├── ShowInfo (poster, metadata, GenreTag[], summary)
│   │   ├── CastList (grid, max 20)
│   │   └── EpisodeList (collapsible seasons)
│   └── SearchView
│       └── SearchResults → ShowCard[] (grid)
└── AppFooter
```

### UI Components (`src/components/ui/`)

- **RatingBadge** — Star + score, color-coded (green/yellow/red)
- **GenreTag** — Badge with deterministic color per genre
- **SkeletonCard** — Shimmer loading placeholder
- **ErrorState** — Error message + retry button
- **LazySection** — IntersectionObserver wrapper for deferred rendering
- **GenrePickerModal** — Genre preference selector with persist to localStorage

---

## UX Patterns

### Lazy Loading

Two layers keep the home page fast:

1. **Progressive API fetching** — `loadShows()` fetches `API_INITIAL_PAGES` (1) on mount. A scroll sentinel near the bottom of the page triggers `loadMore()` which fetches the remaining pages (`API_MAX_PAGES` total). This avoids blocking the initial render with unnecessary network requests.

2. **Lazy section rendering** — Each genre swimlane is wrapped in `LazySection`, which uses `IntersectionObserver` with a `LAZY_ROOT_MARGIN` (400px) buffer. Sections outside this window render a lightweight placeholder instead of the full carousel with all its ShowCards. Once a section enters the viewport, it stays mounted — no re-renders on scroll back up.

### Genre Preferences

- On first visit, a modal asks the user to pick favorite genres (or skip)
- Preferences are saved to `localStorage` and persist across sessions
- Preferred genres are sorted to the top of the swimlane list; remaining genres sort alphabetically
- A filter button in the top-right of the home page reopens the picker with current selections

### Modals & Dialogs

- Must include a visible close button (top-right, `--min-tap-target` sized)
- Must dismiss on `Escape` keypress
- Backdrop click also dismisses

### Loading States

- **Skeleton screens** for initial page load (shimmer animation)
- **Spinners** for detail/search loading
- **Error state** with retry button for failed requests

### Navigation

- Sticky header with logo + search bar
- Back button on detail views
- Route query params for search (`/search?q=`) — bookmarkable/shareable

---

## Accessibility

- Every page/view must have an `<h1>` element for screen readers and a11y compliance
- **Minimum tap target: 44×44px.** All interactive elements must meet WCAG 2.1 touch target guidelines. Use `min-width`/`min-height` or padding. CSS variable `--min-tap-target: 44px` is available.
- Carousel scroll buttons hidden on touch devices (`@media (hover: none)`)
- Images use `loading="lazy"` for off-screen content

---

## Documentation

Two documentation systems, one entrypoint:

- **Vue components** → Storybook autodocs. No `@fileoverview` needed — stories *are* the documentation. Storybook reads component props and JSDoc automatically via the `autodocs` tag.
- **TypeScript files** (API, stores, composables, utils, types, router, tools) → `@fileoverview` JSDoc at the top of each file explaining the file's purpose.

The `docs` task (`tsx tools/dev.ts docs`) enforces this: it scans all `.ts` files in `src/` and fails if any are missing `@fileoverview`. It runs automatically in CI and during dev (the watcher warns on save).

### Why no generated doc site?

For a project this size, inline `@fileoverview` blocks + Storybook autodocs cover everything a developer needs. A tool like TypeDoc would generate a browsable HTML site, but it adds a build step, a hosting target, and a maintenance surface — all for content that's already one click away in the editor or in Storybook. If the project grows to the point where cross-module discovery becomes hard (many packages, public API surface), a generated site makes sense. Until then, doc blocks are the documentation.

### Why hand-written types?

TVMaze does not publish an OpenAPI spec. The types in `src/types/show.ts` are hand-written to cover only the fields the app actually consumes. This avoids the maintenance burden of a self-maintained spec that could silently drift from the real API. If the provider ever publishes a spec, we'd switch to `openapi-typescript` for generation.

---

## Responsive Design

**Mobile-first only.** All CSS is written for the smallest viewport first. Larger viewports are handled with `@media (min-width: ...)` queries. `@media (max-width: ...)` is not permitted anywhere in the codebase.

Breakpoints (defined in `_variables.css`):
- **Default** — Mobile (< 481px)
- **`min-width: 481px`** — Small tablet and up
- **`min-width: 769px`** — Desktop

CSS custom properties scale with breakpoints:
- `--page-padding`: 12px → 16px → 24px
- `--card-width`: 120px → 140px → 180px
- `--card-gap`: 10px → 12px → 16px
- `--header-height`: 56px → 56px → 64px

Typography scales at 769px (h1: 1.5rem → 2rem, h2: 1.25rem → 1.5rem).

---

## Styling Rules

- **Genre colors are fixed.** Every genre has a hardcoded color in `GenreTag.vue`'s `GENRE_COLORS` map. Unknown genres fall back to a deterministic HSL color derived from the genre name hash. To add or change a genre color, edit the map directly.
- **Never use opacity or `transparent` on label/badge backgrounds.** Mix with a solid color (e.g. `var(--color-bg)`) instead. Transparent blending produces unpredictable contrast — dark colors like `#8b0000` at 18% opacity become nearly invisible on dark backgrounds.
- **ABN AMRO color scheme** — Dark mode with black background, teal surfaces/borders, yellow accent (`#ffd200`), green for positive ratings (`#32ae88`).

---

## Build System (`tools/`)

Custom esbuild pipeline with a Vue SFC plugin that:
- Compiles `<script setup>`, `<template>`, and `<style scoped>`
- Injects scoped CSS at runtime via `document.head.appendChild`
- Generates unique scope IDs from file paths

Files: `dev.ts` (CLI + tasks), `esbuild.ts` (shared config), `vueSfcPlugin.ts` (Vue compiler), `html.ts` (HTML generation), `log.ts` (color logging), `docs.ts` (documentation checker), `vercel-build.ts` (Vercel deployment)

Tasks: `dev` (watch + proxy on :5173), `build` (minified, hashed), `test`, `typecheck`, `docs` (JSDoc check), `ci`, `storybook` (dev on :6006)

**`package.json` is developer-facing only** — it exposes a single `pnpm run dev` command for local development. All other tasks (build, test, typecheck, ci) are invoked directly through `tools/dev.ts` (e.g. in CI/CD pipelines). This keeps `package.json` clean and minimal.

### Dev Speed Philosophy

The goal is to make the dev loop as fast as possible. A **chokidar file watcher** sits in front of everything — it watches for file changes and selectively triggers only the work that's needed. Unit tests are **only run when strictly necessary** (e.g. when the changed file has a corresponding test, or during CI). This avoids wasting cycles on a full test suite for every save and keeps feedback instant.

---

## Testing (`src/__tests__/`)

- **API tests** — Mock fetch, verify URL construction, retry logic
- **Store tests** — Mock API, verify genre grouping/sorting, error states
- **Composable tests** — Mount in wrapper component, test reactivity/debounce
- **Component tests** — Mount with test router, verify rendering/links

Fixtures in `src/__tests__/fixtures/shows.ts`.

---

## Deployment

Hosted on Vercel at `abn-coding-assignment.vercel.app`.

- **Build Output API v3** — `tools/vercel-build.ts` runs the esbuild production build, then assembles the `.vercel/output/` directory with static files, routing config, and an Edge Middleware function.
- **Basic auth** — An Edge Middleware checks HTTP Basic Auth on every request. The password is read from `.env` at build time and embedded into the middleware bundle. Credentials: `reviewer` / password from `.env`.
- **No indexing** — `X-Robots-Tag: noindex, nofollow` is set on all responses via the routing config. This is a private coding assignment, not a public site.
- **SPA fallback** — Non-asset routes fall back to `index.html` for client-side routing.

Deploy manually: `vercel deploy --prod`

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Custom esbuild over Vite | Fine-grained control over Vue SFC compilation |
| Module-scoped refs over Pinia | Single store doesn't justify a library; Vue's reactivity is enough |
| History mode router | Clean URLs (`/shows/123` not `/#/shows/123`) — prettier, shareable, SEO-friendly |
| Route query params for search | Bookmarkable/shareable search URLs |
| Composables over mixins | Better reuse, type safety, tree-shaking |
| Passive scroll listeners | Performance for carousel scroll tracking |
| Minimal package.json | Only `dev` script for developers; CI/CD calls tools/dev.ts directly |
| Progressive API loading | Fast initial render; remaining data loaded on scroll |
| Genre prefs in localStorage | No backend needed; persists across sessions |

---

## Storybook

**Storybook is the source of truth for components.** Build and validate components in Storybook first, then compose them in the app. This ensures components are reusable and self-contained. Before creating new components, always check Storybook for existing ones that can be reused or composed.

- Run with `tsx tools/dev.ts storybook` (port 6006)
- **Stories are co-located** — each `.stories.ts` file sits next to its component in the same directory. This mirrors the Storybook sidebar hierarchy: `Elements/` stories live in `src/components/ui/`, `Compositions/` in `src/components/show/` and `src/components/search/`, `Pages/` in `src/views/`. Shared fixtures live in `src/stories/_fixtures.ts`.
- Config in `.storybook/` (main.ts, preview.ts)
- Global styles are loaded in preview.ts
- Autodocs enabled via `tags: ['autodocs']` — Storybook auto-generates a Docs page per component
- **Pages are storied too** — each page has stories for every state (loading, error, empty, loaded) rendered with fixture data. This keeps all visual tracking in one place so you never have to leave Storybook to verify how a page looks.

### Component Inventory

Components are grouped into three tiers: **Elements** → **Compositions** → **Pages**.

- **Elements** — isolated, single-purpose components you inspect one at a time. No domain logic, no child component imports — just props in, visuals out. Use these stories to verify sizing, color, and internal spacing.
- **Compositions** — multiple elements working together. Use these stories to verify integration: whitespace between elements, alignment, overflow behavior, and how components respond to each other's sizing. A `ShowCard` composes `RatingBadge` with show-specific layout; a `ShowCarousel` composes multiple `ShowCard`s with scroll behavior and gap spacing.
- **Pages** — full route-level views that wire compositions to data via composables. These handle loading, error, and empty states.

#### Elements — `src/components/ui/`

| Component | Stories | Props |
|-----------|---------|-------|
| AppButton | AllVariants | `variant?: 'primary' \| 'info' \| 'success' \| 'warning' \| 'error'`, `size?: 'sm' \| 'md'` |
| RatingBadge | High, Mid, Low, NoRating | `rating: number \| null` |
| GenreTag | AllGenres | `genre: string` |
| LazySection | — | emits `visible` / IntersectionObserver with `LAZY_ROOT_MARGIN` |
| AppDisclosure | Closed, Open, Stacked | `label: string`, `detail?: string`, `open?: boolean` / slot |
| SkeletonCard | Default, Row | — |

#### Compositions — `src/components/show/`, `src/components/search/`, `src/components/ui/`

| Component | Stories | Props |
|-----------|---------|-------|
| ErrorState | Default, ShortMessage | `message: string` / emits `retry` |
| ShowCard | Default, NoImage, LowRating | `show: Show` |
| ShowCarousel | Default, FewItems | `shows: Show[]` |
| GenreSection | Default | `genre: string, shows: Show[]` |
| ShowInfo | Default, NoImage | `show: ShowDetail` |
| CastList | Default, Empty | `cast: CastMember[]` |
| EpisodeList | Default, Empty | `seasonMap: Map<number, Episode[]>` |
| SearchResults | Default, Empty | `shows: Show[]` |

#### Pages — `src/views/`

| View | Route | Composes |
|------|-------|----------|
| HomeView | `/` | GenreSection → ShowCarousel → ShowCard |
| ShowDetailView | `/shows/:id` | ShowInfo, CastList, EpisodeList |
| SearchView | `/search?q=` | SearchResults → ShowCard |

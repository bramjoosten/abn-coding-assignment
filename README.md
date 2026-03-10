# ABN AMRO Coding Assignment

TV Show Dashboard built with Vue 3, TypeScript, and a custom esbuild build system.

**Live:** https://abn-coding-assignment.vercel.app
(Basic auth credentials were shared by email.)

## Getting started

```bash
pnpm install
pnpm run dev        # http://localhost:5173
```

## Tasks

All tasks run through `tools/dev.ts` — this way we can share them between `package.json` and CI/CD commands, keeping `package.json` readable:

```bash
npx tsx tools/dev.ts dev         # Dev server with hot reload
npx tsx tools/dev.ts build       # Production build
npx tsx tools/dev.ts test        # Unit tests (Vitest)
npx tsx tools/dev.ts typecheck   # Type checking (vue-tsc)
npx tsx tools/dev.ts docs        # Documentation coverage check
npx tsx tools/dev.ts storybook   # Storybook on :6006
npx tsx tools/dev.ts ci          # Full CI pipeline
```

## Project structure

```
src/
  main.ts                    — App entry point
  App.vue                    — Root component (header + router-view + footer)
  assets/styles/             — Global CSS (variables, reset, typography, transitions)
  components/
    layout/                  — AppHeader, AppFooter
    search/                  — SearchBar, SearchResults
    show/                    — ShowCard, ShowCarousel, GenreSection, ShowInfo, CastList, EpisodeList
    ui/                      — RatingBadge, GenreTag, SkeletonCard, ErrorState, LazySection, GenrePickerModal, AppButton, AppDisclosure
  composables/               — useShows, useShowDetail, useSearch
  stores/                    — showStore (module-scoped refs)
  api/                       — client.ts (base fetch), shows.ts (TVMaze API)
  views/                     — HomeView, ShowDetailView, SearchView
  types/                     — show.ts
  __tests__/                 — Unit tests (mirrors src structure)
```

## Conventions

- Scoped styles in Vue SFCs
- Mobile-first CSS only (`min-width` queries, no `max-width`, unless absolutely necessary)
- Components use PascalCase filenames
- Composables prefixed with `use`
- Tests in `src/__tests__/` with `.spec.ts` extension
- Path alias: `@` → `src/`

## Design decisions

The reasoning behind the major choices in this project — from UX patterns and performance strategies to software architecture and deployment — is documented in [ARCHITECTURE.md](ARCHITECTURE.md).

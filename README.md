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

All tasks run through `tools/dev.ts`:

```bash
npx tsx tools/dev.ts dev         # Dev server with hot reload
npx tsx tools/dev.ts build       # Production build
npx tsx tools/dev.ts test        # Unit tests (Vitest)
npx tsx tools/dev.ts typecheck   # Type checking (vue-tsc)
npx tsx tools/dev.ts docs        # Documentation coverage check
npx tsx tools/dev.ts storybook   # Storybook on :6006
npx tsx tools/dev.ts ci          # Full CI pipeline
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for stack, data flow, component inventory, and design decisions.

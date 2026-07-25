# Coding Conventions & Standards

## Code Style & Formatting
- **Linter / Formatter**: Biome configuration (`biome.jsonc`) is used instead of ESLint/Prettier for linting and formatting.
- **Imports**: Modules use ES Module syntax (`import/export`) with path aliases configured (`~/*` mapping to `./src/*`).

## Type Safety
- **Strict Mode**: TypeScript strict mode enabled in `tsconfig.json`.
- **Environment Safety**: Environment variables strictly validated at runtime via `src/env.js` using `@t3-oss/env-nextjs` and `zod`.
- **API Contracts**: tRPC procedures enforce inputs with Zod schemas.

## Component Patterns
- Server Components by default in `src/app/`.
- Client Components marked explicitly with `"use client"`.

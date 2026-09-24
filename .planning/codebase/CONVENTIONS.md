# Conventions

- **Typescript**: Strict typing enforced. Avoid `any`. Interfaces/types should be placed alongside their domain or in `src/types/`.
- **Linting & Formatting**: Biome is used instead of ESLint/Prettier. Run `pnpm check` to verify.
- **Component Design**: Use standard shadcn/ui patterns. Server components by default, use `"use client"` only when interactivity (hooks, state) is needed.
- **Data Fetching**: Use tRPC for all internal API calls. Avoid raw `fetch` unless integrating with third-party APIs externally.
- **Styling**: Tailwind CSS v4. Use `cn()` utility (clsx + tailwind-merge) for dynamic class names.
- **Environment Variables**: Managed and validated by `@t3-oss/env-nextjs` in `src/env.js`.

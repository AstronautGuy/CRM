# Conventions

- **Linting & Formatting**: Enforced by Biome (replaces Prettier/ESLint). Run `pnpm check`.
- **Typing**: Strict TypeScript definitions. No `any` unless absolutely necessary.
- **Styling**: Tailwind CSS classes. Use `cn` utility from `clsx` and `tailwind-merge` for conditional classes.
- **Components**: Functional components using React 19 features.
- **API**: Define all backend endpoints within the tRPC router for type safety.

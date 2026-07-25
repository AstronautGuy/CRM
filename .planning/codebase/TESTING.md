# Testing Setup & Strategy

## Automated Testing Frameworks
- Currently no automated unit or end-to-end test framework (e.g., Vitest, Jest, Playwright) is pre-configured in `package.json`.

## Quality Check Scripts
- `pnpm check`: Executes `biome check .` for static analysis and linting.
- `pnpm typecheck`: Executes `tsc --noEmit` to verify type safety across the application.

# Testing

- No testing framework (e.g., Vitest, Jest, Playwright) is currently installed or configured in `package.json`.
- Type checking is enforced via `tsc --noEmit`.
- Linting and static analysis is enforced via Biome (`pnpm check`).
- Manual testing is required for now. Future phases should introduce unit testing (Vitest) and E2E testing (Playwright).

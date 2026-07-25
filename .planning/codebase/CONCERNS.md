# Codebase Concerns & Known Limitations

## Architecture & Scalability
- **Starter Template State**: The codebase is currently at initial boilerplate stage generated from Create T3 App.
- **Database Dependency**: Local development requires a running PostgreSQL instance (or executing `./start-database.sh`).

## Test Coverage
- **Lack of Automated Tests**: No unit/integration test runner is installed; reliance is entirely on static analysis (`tsc`, `biome`).

## Technical Debt / Items to Track
- Need to establish authentication strategy (e.g. NextAuth / Auth.js or Clerk) if required for CRM capabilities.
- UI component library (e.g. Shadcn UI) can be added to accelerate development.

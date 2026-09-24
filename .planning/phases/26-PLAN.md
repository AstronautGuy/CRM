# Phase 26: API Authentication & Key Management

## Goal
Implement API key generation, revocation, and viewing in user settings. Secure API routes using a middleware/auth guard based on these keys.

## Context
- **Milestone 5**: Public API & Webhooks
- **Framework**: Next.js 15
- **ORM**: Drizzle ORM (PostgreSQL)

## Execution Plan

### Task 1: Database Schema Updates
- **File**: `src/server/db/schema.ts`
- **Action**: Add an `apiKeys` table.
- **Fields**: `id`, `userId` (relation to user), `keyHash` (store hashed version of the key), `name` (e.g., "Production Key"), `createdAt`, `expiresAt`, `revokedAt`.
- **Note**: Ensure the Drizzle migration is generated (`pnpm db:generate`).

### Task 2: tRPC Router for API Keys
- **File**: `src/server/api/routers/apiKeys.ts`
- **Action**: Create a new tRPC router with procedures:
  - `list`: Get all non-revoked API keys for the current user.
  - `create`: Generate a new API key, hash it for storage, store in DB, and return the raw key to the client exactly ONCE.
  - `revoke`: Mark a key as revoked (`revokedAt = now()`).
- **Integration**: Add to `src/server/api/root.ts`.

### Task 3: UI for Managing API Keys
- **File**: `src/app/(dashboard)/settings/api-keys/page.tsx`
- **Action**: Build a settings page section.
- **Components**: 
  - Data table/list to display active keys.
  - Button/modal to "Generate New API Key".
  - Alert dialog for displaying the generated raw key (with a "Copy to clipboard" button and a warning that it won't be shown again).
  - Button to "Revoke" an existing key.

### Task 4: API Authentication Middleware/Guard
- **File**: `src/server/api/trpc.ts` or `src/middleware.ts`
- **Action**: Implement authentication logic for external programmatic access.
- **Details**:
  - Accept `Authorization: Bearer <API_KEY>` or a custom header `X-API-Key`.
  - Validate the key against the hashed value in the database.
  - Attach the authenticated `userId` to the request context.
- **Testing Route**: Create a simple test route `src/app/api/v1/me/route.ts` that returns the authenticated user's info using the API key.

## Verification
- Verify that a user can generate a key, see it once, and copy it.
- Verify that revoked keys can no longer authenticate.
- Verify that the test API route `GET /api/v1/me` works with a valid key and rejects invalid or revoked keys.

# Phase 27: Outbound Webhooks System

## Goal
Implement outbound webhooks for the CRM using Svix. When core events occur (e.g., `invoice.created`, `client.added`), the system will dispatch payloads to Svix, which will securely route them to users' configured endpoints.

## Context
- **Milestone 5**: Public API & Webhooks
- **Framework**: Next.js 15
- **Research**: `.planning/research/webhooks.md`

## Execution Plan

### Task 1: Add Svix Dependency and Config
- **Action**: Install the `svix` package (`pnpm add svix`).
- **File**: `src/env.js`
  - Add `SVIX_TOKEN: z.string().min(1)` to server environment variables.
- **File**: `src/lib/svix.ts`
  - Initialize and export the Svix client instance `new Svix(env.SVIX_TOKEN)`.

### Task 2: Database Schema Updates
- **File**: `src/server/db/schema.ts`
- **Action**: Add `svixAppId: d.varchar({ length: 255 })` to the `organizations` table.
  - Generate the DB migration (`pnpm db:generate`).

### Task 3: Svix App Provisioning via tRPC
- **File**: `src/server/api/routers/webhooks.ts`
- **Action**: Create a tRPC router for webhook settings.
- **Procedures**:
  - `getAppPortalUrl`: Checks if the organization has a `svixAppId`. 
    - If no: Uses the Svix SDK to create an App (`svix.application.create`) for the organization, saves the generated ID to `organizations.svixAppId`, and returns an App Portal magic link (`svix.authentication.appPortalAccess`).
    - If yes: Generates and returns the App Portal magic link.
- **Integration**: Add to `src/server/api/root.ts`.

### Task 4: Webhook Configuration UI
- **File**: `src/app/(dashboard)/settings/webhooks/page.tsx`
- **Action**: Build the webhooks settings page.
  - Fetch the App Portal link using the tRPC route.
  - Render a button or automatically embed an iframe showing the Svix App Portal so the user can configure their endpoints.

### Task 5: Event Dispatch Utility
- **File**: `src/server/webhooks/dispatch.ts`
- **Action**: Create a helper function `dispatchWebhook(orgId: string, eventType: string, payload: any)`.
  - It fetches the `svixAppId` for the organization.
  - If present, uses `svix.message.create(appId, { eventType, payload })` to enqueue the webhook.

### Task 6: Wire up Trigger Events
- **File**: (Various locations where actions happen, e.g., `src/server/api/routers/crm.ts`, `billing.ts`)
- **Action**: Integrate `dispatchWebhook` into key mutations:
  - When a contact is created: dispatch `client.added`.
  - When an invoice is created/paid: dispatch `invoice.created` / `invoice.paid`.

## Verification
- Verify the DB migration succeeds.
- Verify that a user can visit the Webhooks settings page and load the Svix App Portal.
- Verify that a test payload is successfully enqueued to Svix when a client is created.

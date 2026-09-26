# Phase 27: Tenant Management & Global Settings - Plan

## Step 1: Database Schema Updates
- **`src/server/db/schema.ts`**:
  - Add `isActive` boolean to `organizations` table (default `true`).
  - Add a `globalSettings` table with columns: `id`, `maintenanceMode`, `enableBetaFeatures`.

## Step 2: TRPC Superadmin Additions
- **`src/server/api/routers/superadmin.ts`**:
  - Update `getOrganizations` to return the `isActive` flag and member counts.
  - Add mutation `toggleOrganizationStatus` (flips `isActive`).
  - Add mutation `deleteOrganization` (cascades or drops the org).
  - Add queries/mutations for `globalSettings`.

## Step 3: Frontend Sub-pages
- **`src/app/superadmin/tenants/page.tsx`**:
  - Implement a Data Table fetching `getOrganizations`.
  - Add action dropdowns for "Impersonate", "Suspend", and "Delete".
- **`src/app/superadmin/settings/page.tsx`**:
  - Implement a simple form or toggle switches to control `maintenanceMode` and `enableBetaFeatures`.

## Step 4: Verification
- Verify that a suspended organization cannot be logged into or accessed (we may need to update the core TRPC middleware to block `isActive === false`).
- Verify the global settings toggle.

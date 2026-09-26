# Phase 27: Tenant Management & Global Settings - Context

## Objective
Provide the Super Admin with a granular list of all organizations (tenants), enabling actions like impersonation, suspension, and deletion. Introduce basic global feature flags that affect all tenants.

## Scope
1. **Tenant List UI**: 
   - A data table view at `/superadmin/tenants`.
   - Display organization name, slug, created date, and total users inside the org.
2. **Management Actions**:
   - Add the ability to impersonate a tenant (already stubbed in TRPC).
   - Add the ability to Suspend or Delete a tenant organization from the UI.
   - For suspension, we need an `isActive` or `status` flag on the `organizations` table.
3. **Global Settings**:
   - A very basic JSON blob or environment variable-like control for feature flags in the database (or just mocked in UI for MVP). We'll add a `globalSettings` table or handle it purely in memory/env for simplicity, but a `globalSettings` single-row table is better for UI control.

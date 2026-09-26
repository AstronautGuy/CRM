# Phase 26: Super Admin Infrastructure & Health Metrics - Context

## Objective
Implement a "Super Admin" layer for platform owners to access a dedicated dashboard (`/superadmin`) protected by a specific role or flag. Display system health metrics (active users, organizations count, error rates, DB size) and track global platform revenue across all tenants.

## Scope
1. **Super Admin Role**: 
   - Add a `role` column to the `users` table, allowing values like `USER` and `SUPER_ADMIN`.
   - Update `protectedProcedure` or create a new `superadminProcedure` in TRPC that verifies this role.
2. **Super Admin Dashboard Route**:
   - Create `src/app/superadmin/layout.tsx` and `page.tsx`.
   - Ensure a robust middleware or layout-level check to redirect non-super-admins to `/dashboard` or `/login`.
3. **Health & Revenue Metrics**:
   - Create `superadminRouter` (`src/server/api/routers/superadmin.ts`) to fetch aggregate platform stats.
   - Aggregate all organizations count.
   - Aggregate global revenue (e.g., total volume processed by all organizations, perhaps derived from all `payments`).
   - Mock error rates or DB size if actual queries are too complex for the MVP, but display them beautifully in the UI.

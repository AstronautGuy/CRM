# Phase 28: Super Admin & Tenant Admin Panels - Execution Plan

## 1. Refactor Super Admin Layout & Route Protection
- **Goal**: Give the developer/super-admin panel a dedicated, distinct look and strictly protect it.
- **Files**:
  - `src/components/layout/superadmin-layout.tsx` (New)
  - `src/app/admin/layout.tsx` (New/Modify)
  - `src/app/admin/page.tsx`
- **Actions**:
  - Create `SuperAdminLayout` with a darker, unique theme and its own sidebar navigation (`Dashboard`, `Organizations`, `Users`, `Settings`). Ensure all new super admin features have visible navigation buttons.
  - Create an `admin/layout.tsx` that wraps children in `SuperAdminLayout` and checks `session.user.systemRole === "SUPER_ADMIN"`, redirecting to `/dashboard` otherwise.
  - Refactor `admin/page.tsx` to use the new layout implicitly via `layout.tsx` instead of wrapping itself. Ensure the main super admin page has cards/buttons linking to all available super admin tools.

## 2. Super Admin API & Global Views
- **Goal**: Build global views to manage all tenants and users.
- **Files**:
  - `src/server/api/routers/superadmin.ts` (New)
  - `src/server/api/root.ts`
  - `src/app/admin/organizations/page.tsx` (New)
  - `src/app/admin/users/page.tsx` (New)
- **Actions**:
  - Implement tRPC router `superadmin` with protected procedures checking `systemRole`.
  - Add `getOrganizations` and `getUsers` queries (bypassing tenant filters).
  - Build the UI tables in the new routes to display this global data.

## 3. Impersonation Implementation
- **Goal**: Allow Super Admins to securely "Login as Client".
- **Files**:
  - `src/server/auth.ts`
  - `src/server/api/routers/superadmin.ts`
  - `src/app/admin/organizations/page.tsx`
- **Actions**:
  - Add `impersonateOrganization` mutation that sets an HTTP-only cookie (`devcrm_impersonate_org`).
  - Modify the `auth()` callback in `auth.ts`: if the user is a `SUPER_ADMIN` and the impersonate cookie exists, temporarily swap their `organizationId` in the session object so the rest of the app thinks they belong to that org.
  - Add a "Stop Impersonating" button/banner to `DashboardLayout` that appears when a cookie is active, linking to an endpoint that clears the cookie.

## 4. Tenant Admin Setup (`/dashboard/admin`)
- **Goal**: Provide a scoped workspace admin section for company owners.
- **Files**:
  - `src/app/dashboard/admin/layout.tsx` (New)
  - `src/app/dashboard/admin/page.tsx` (New)
  - `src/app/dashboard/admin/workspace/page.tsx` (New)
- **Actions**:
  - Create a layout guard ensuring the user is `OWNER` or `ADMIN` of their current organization.
  - Build a secondary sub-navigation (e.g., Tabs or sidebar) for `Workspace`, `Users`, `Billing`, `Webhooks`, and any other existing CRM settings features so they are all interlinked.
  - Migrate the UI from `/settings/organization` into `/dashboard/admin/workspace`.
  - Add explicit entry-point buttons to `/dashboard/admin` from the main client `DashboardLayout` so users can easily discover the tenant admin area.

## 5. Clean Up & Final Audit
- **Goal**: Ensure the old scattered settings are removed and everything works end-to-end.
- **Files**:
  - `src/app/settings/organization/page.tsx` (Delete/Redirect)
  - `src/components/layout/dashboard-layout.tsx`
- **Actions**:
  - Remove `adminNav` from `DashboardLayout` (as Super Admin has its own layout now).
  - Update any existing tenant links to point to `/dashboard/admin`. Ensure the client layout's sidebar is fully synced and updated with all recent CRM features (like Webhooks, API keys, Billing).
  - Run a manual audit and write tests verifying that a `USER` cannot access `/admin` and a `MEMBER` cannot access `/dashboard/admin`.

## 6. Standing Rule: Navigation Completeness
- **Goal**: Ensure no feature is ever "orphaned" without a UI button to reach it.
- **Actions**:
  - Review all existing CRM modules (Webhooks, Inventory, Pipeline, API Keys) and verify there is a clear button/link in either the main `DashboardLayout`, the `SuperAdminLayout`, or the `TenantAdminLayout` to access them.

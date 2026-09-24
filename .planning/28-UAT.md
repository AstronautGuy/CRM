# Phase 28: Super Admin & Tenant Admin Panels - UAT

## Test Scenarios

### Scenario 1: Super Admin Layout & Route Protection
- [x] User with `SYSTEM_ROLE=SUPER_ADMIN` can access `/admin`.
- [x] User with `SYSTEM_ROLE=USER` is redirected away from `/admin` to `/dashboard`.
- [x] The `/admin` layout uses the dark, distinct Super Admin theme with its own sidebar.
- [x] The Super Admin logout button redirects properly to `/login`.

### Scenario 2: Super Admin API & Global Views
- [x] The `/admin/organizations` page lists all organizations across the platform.
- [x] The `/admin/users` page lists all users.

### Scenario 3: Impersonation Implementation
- [ ] A Super Admin can click "Login as Client" from an organization's actions, which sets the `devcrm_impersonate_org` cookie.
- [ ] The user is redirected to the `/dashboard`, seeing the impersonated organization's data.
- [ ] The Impersonation Banner appears globally at the top of the screen ("You are impersonating...").
- [ ] Clicking "Stop Impersonating" clears the cookie and redirects back to `/admin`.

### Scenario 4: Tenant Admin Setup
- [ ] A user with role `OWNER` or `ADMIN` can access `/dashboard/admin`.
- [ ] A user with role `MEMBER` is redirected away from `/dashboard/admin` to `/dashboard`.
- [ ] Tenant Admin layout contains navigation for Workspace, Users, Billing, Webhooks, API Keys, etc.

### Scenario 5: Onboarding & Authentication Safeguards
- [ ] Newly registered users are not forcefully redirected but see a "Feature Blocked" overlay in their workspace.
- [ ] Clicking "Complete Onboarding" creates the organization correctly without duplicates.
- [ ] Once onboarding is complete, the blocked UI disappears and features are unlocked.
- [ ] Sidebar dynamically displays the accurate organization name and logged-in user details.

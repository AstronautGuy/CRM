# Phase 27: Tenant Management & Global Settings - Summary

## What Was Done
1. **Schema Updates:** Added an `isActive` boolean to the `organizations` table, enabling suspension of tenants without deleting their data. Created a `globalSettings` table storing boolean flags like `maintenanceMode` and `enableBetaFeatures`.
2. **Tenant Operations (Backend):** Expanded the `superadminRouter` with mutations to toggle the active status of an organization (`toggleOrganizationStatus`), completely drop an organization (`deleteOrganization`), and fetch/update settings (`getGlobalSettings`, `updateGlobalSettings`).
3. **Tenant Management UI:** Developed a full data table view at `/superadmin/tenants` using Shadcn UI table elements. The UI allows super admins to Impersonate, Suspend/Activate, and permanently Delete any organization.
4. **Global Settings UI:** Developed `/superadmin/settings` rendering toggles for the global flags, connecting seamlessly to the database table with fallback default initialization.

## How to Test
1. Make sure your user role is `SUPER_ADMIN`.
2. Navigate to `/superadmin/tenants`. Try suspending an organization (the badge should update to 'Suspended'). Try impersonating one (you'll be redirected to the app dashboard).
3. Navigate to `/superadmin/settings`. Toggle the 'Maintenance Mode' or 'Beta Features' switches. The database settings will save instantly.

# Phase 28: Super Admin & Tenant Admin Panels - Context

## Executive Summary
This phase restructures the administrative interfaces of the application to clearly separate system-level administration (Super Admin) from workspace-level administration (Tenant Admin). The goal is to provide developers/operators with a powerful, distinct global dashboard while giving tenant owners a dedicated, scoped area to manage their company resources.

## 1. Developer / Super Admin Panel (`/admin`)
**Design & Layout:**
- Must use a completely dedicated, unique UI layout (different sidebar, unique theme/colors) so it is visually distinct from the main client `DashboardLayout`.
- Protected by a strict auth guard ensuring only users with `systemRole === "SUPER_ADMIN"` can access it.

**Core Capabilities:**
- **Global Organizations:** View all tenants, see their stats, suspend/activate them.
- **Global Users:** View all registered users across the SaaS, reset passwords, delete accounts.
- **Global Settings:** Manage global configs like webhook setups, SaaS subscription tiers, etc.
- **Impersonation:** An ability to "Login as Client" to debug a specific workspace without asking for credentials.

## 2. Tenant / Client Admin Page (`/dashboard/admin`)
**Design & Layout:**
- Lives inside the client's workspace route as a dedicated sub-section (e.g., `/dashboard/admin` or similar).
- Accessible only to tenant users with role `OWNER` or `ADMIN`.

**Core Capabilities:**
- Its own sub-navigation for managing workspace-level configurations.
- Consolidates workspace settings (currently scattered in `/settings/organization`, users, billing, etc.) into one restricted but easily accessible area.

## Technical Considerations
- **Routing & Middleware:** Needs robust routing logic to enforce boundary checks (System roles vs. Tenant roles).
- **Impersonation Logic:** Needs careful handling in NextAuth/session to safely assume another user's identity and revert back.
- **Data Isolation:** Ensure Super Admin queries deliberately bypass the `organizationId` multi-tenant filters that normally scope queries.

*No additional context needed. Downstream agents can act on these decisions directly.*

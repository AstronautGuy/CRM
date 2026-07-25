# Phase 1 Context - Foundation & Authentication Setup

## Key Decisions

### 1. Authentication Framework
- **Provider**: NextAuth.js (Auth.js) integrated with Drizzle ORM adapter.
- **Login Methods**:
  - Social OAuth logins (GitHub / Google).
  - Credentials login (Email + Password).
  - Phone number + Password support.

### 2. Multi-Tenancy & Authorization Model
- **Super Admin (System Owner)**: Platform-level administration to manage client companies/organizations, global feature flags, and access controls.
- **Hierarchical Multi-Tenancy (Organizations)**:
  - Each customer is an Organization/Company tenant.
  - Organization Admins can manage internal employees, assign internal roles (Manager, Rep, Viewer), and configure feature access within their tenant scope.
- **RBAC**: Multi-tiered role-based access control (Super Admin -> Org Admin -> Org Member / Role).

### 3. UI Design System & Component Library
- **Component System**: Shadcn UI tailored with TailwindCSS v4 and Radix primitives.
- **Styling**: Sleek dark mode / modern responsive dashboard theme.

### 4. Subscription Billing & Super Admin Controls
- **SaaS Subscription Billing**: DevCRM will be subscription-based for client organizations/companies.
- **Super Admin Management**: Super Admin has platform-level control to manage pricing plans, subscription tiers, billing cycles, and manual/automated payment management for client companies.
- **Tenant Licensing**: Organizations subscribe to specific plans which gate feature access across the CRM.

### 5. Database Schema Scope (Phase 1)
- `users` table (auth, emails, phone, roles)
- `accounts` & `sessions` tables (NextAuth compatibility)
- `organizations` table (tenants)
- `organization_members` table (user-to-org relationships + org-level roles)
- `subscription_plans` table (plan tiers, prices, feature limits)
- `subscriptions` table (org subscriptions, statuses, renewal dates)


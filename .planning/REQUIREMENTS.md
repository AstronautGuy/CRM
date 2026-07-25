# Milestone 4 Requirements: MVP Polish & Central Dashboard

## Context
The core systems for CRM (Contacts), Deal Pipeline, and Billing (Invoices/Quotes) were built in Milestones 1 & 2. However, the user experience is currently disconnected because the central `/dashboard` page is missing (returning a 404), leading users to believe the features do not exist. 

## Scope
1. **Central Dashboard (`/dashboard`)**:
   - Build a comprehensive overview page displaying key metrics: total contacts, active pipeline value, recent invoices, and pending tasks.
   - Serve as the default landing page post-login.
2. **Navigation Fixes**:
   - Ensure all sidebar links in `dashboard-layout.tsx` accurately point to implemented pages (Contacts, Pipeline, Billing, Products, Marketing).
3. **Feature Enhancements**:
   - Make the "Quote Maker" and "Invoice Maker" more prominent within the `/billing` section with clear Call-to-Action buttons.
   - Enhance the "Customer Database" (`/contacts`) with clearer empty states and immediate data entry forms.

## Phases
- **Phase 7**: Central Dashboard & Navigation Fixes
- **Phase 8**: Billing & CRM UI Enhancements

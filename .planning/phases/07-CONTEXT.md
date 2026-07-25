# Phase 7 Context - Central Dashboard & Navigation

## Decisions & Scope

### 1. Dashboard Layout & Customization
- **Layout Approach**: The dashboard will feature a top row of 4 KPI cards (Total Contacts, Pipeline Value, Unpaid Invoices, Tasks Due), followed by a Recent Activity table and a Pipeline Chart.
- **Customizability**: The user specifically requested that the dashboard be customizable (e.g., toggling widgets, reordering).
  - **Technology**: We will introduce `zustand` for client-side state management. The Zustand store will persist the user's dashboard layout preferences (e.g., an array of active widget IDs and their order) into `localStorage`.

### 2. Navigation & Routing Fixes
- **Sidebar Integration**: Update `dashboard-layout.tsx` to ensure all links correctly point to the implemented pages: `/dashboard`, `/contacts`, `/pipeline`, `/billing`, `/products`, `/marketing`, `/tasks`.
- **Middleware Redirect**: Update `middleware.ts` so that when a user logs in, they are redirected to `/dashboard` instead of `/pipeline` (the current default).

### 3. Data Fetching
- **tRPC Implementation**: A new procedure (e.g., `getDashboardMetrics` within `crmRouter` or a dedicated `dashboardRouter`) will aggregate the necessary KPI data from the Drizzle ORM in a single query to ensure the dashboard loads quickly.

## Excluded from this Phase
- Detailed UI enhancements for Billing and CRM modals (reserved for Phase 8).

# Phase 25: Advanced Dashboard & Reporting - Plan

## Step 1: Analytics Router Backend
- **`src/server/api/routers/reporting.ts`**:
  - Implement a new TRPC router `reportingRouter` in a new file.
  - Query: `getDashboardMetrics` (input: `organizationId` and optional `dateRange`).
  - Calculate:
    - **Total Revenue**: Sum of all `payments` associated with the org's invoices, or sum of `totalAmount` for paid invoices.
    - **Outstanding Balance**: Sum of unpaid invoice totals.
    - **Sales Win Rate**: Proportion of `deals` in `CLOSED_WON` status vs total deals.
    - **Leads Generated**: Count of `contacts` where `source` is "AD_CAMPAIGN" or "PUBLIC_CATALOGUE".
- Export the router and add it to the root router (`src/server/api/root.ts`).

## Step 2: Main Dashboard Refactoring
- **`src/app/dashboard/page.tsx`** (or main page):
  - Refactor to consume `api.reporting.getDashboardMetrics`.
  - Use `recharts` if installed, otherwise build beautiful metric cards and progress bars.
  - Ensure the dashboard aligns with our premium dark-mode or sleek-light aesthetic.
  - Create a mock chart visual for "Revenue Over Time" using CSS gradients and SVG or standard HTML elements.

## Step 3: Verification
- Verify that `reportingRouter` works and calculates correctly based on dummy data.
- Ensure the main dashboard `/dashboard` loads seamlessly.
- Check typescript compilation.

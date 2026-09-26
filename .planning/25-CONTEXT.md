# Phase 25: Advanced Dashboard & Reporting - Context

## Objective
To build a comprehensive, high-level dashboard and advanced reporting system for Organization Admins. This dashboard will aggregate data across multiple domains (Finance, Sales, Marketing, and Operations) to provide real-time insights into the health of the organization.

## Technical Scope
1. **Reporting Endpoints:**
   - Create a dedicated TRPC router `reportingRouter` (`src/server/api/routers/reporting.ts`) to calculate and fetch key metrics:
     - **Financial Metrics:** Total Revenue, Outstanding Invoices, Monthly Recurring Revenue (MRR - if applicable via subscriptions), Average Deal Size.
     - **Sales Pipeline:** Win rate, number of deals per stage, lead conversion rate.
     - **Marketing ROI:** Aggregate ROAS, total ad spend, and Cost Per Lead (CPL).
     - **Team Performance:** Number of tasks completed per member, quotes sent vs. accepted.
2. **Dashboard UI:**
   - Overhaul the main `/dashboard` (which currently may be minimal) to include a dynamic layout with graphical charts (using Recharts or similar charting libraries if available, or just rich UI components/cards).
   - Add a date range picker to allow the admin to filter data (e.g., Last 30 Days, Year to Date).
3. **Data Aggregation:**
   - Ensure the queries are optimized and run efficiently, utilizing Drizzle ORM aggregations (`sum`, `count`, etc.).

## Assumptions
- We will rely on existing data structures (Invoices, Deals, Quotes, Contacts, Tasks, AdCampaigns). No major database changes are strictly required, though a few composite indexes could be added if performance is an issue (we will assume standard queries are sufficient for now).
- The user is the Tenant Admin, so all queries must be scoped to `organizationId`.

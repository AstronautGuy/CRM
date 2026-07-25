# Phase 4 Context - Quotes, Invoices & Subscriptions

## Key Decisions

### 1. Products & Inventory Data Model
- **Product & Service Catalog**: Track SKUs, product/service name, description, unit price, tax rates, and inventory stock quantity.

### 2. Quotes & Invoices Workflow
- **Quote Creation**: Line items linked to products/services, unit quantity, discount %, tax calculation, and total price.
- **Invoice Generation**: Convert approved quotes to invoices with status tracking (`DRAFT`, `SENT`, `PAID`, `OVERDUE`).
- **Export Formats**: Both downloadable PDF export and printable HTML web view for quotes & invoices.

### 3. Client Recurring Subscriptions
- **Recurring Customer Subscriptions**: Track client billing cycles (monthly/yearly), renewal dates, auto-generated invoices, and subscription statuses.

# Phase 21: Subscriptions - Context

## Locked Decisions

1. **Purpose**: 
   - This feature allows the CRM user (the agency/business) to track recurring services (subscriptions) that their clients have purchased from them (e.g., cloud servers, websites, domains, hosting).

2. **Catalog Integration**:
   - Client subscriptions will link directly to items from the Product Catalog (specifically, `SERVICE` or recurring `PRODUCT` items) to define the base price and description.

3. **Billing Mechanism**:
   - We will start with manual billing. 
   - The system will provide a dashboard showing all active client subscriptions, their billing cycles (e.g., monthly, yearly), and their upcoming renewal dates. 
   - The user will manually create the invoices when a subscription is due for renewal. 
   - Automated invoice generation (cron jobs) is deferred for now to keep the architecture simple.

## Technical Notes
- We will need a new database table `devcrm_client_subscription` to track these agreements, as the existing `devcrm_subscription` table is reserved for the CRM's own multi-tenant SaaS billing.
- Fields needed: `id`, `organizationId`, `companyId`, `productId`, `status` (ACTIVE, CANCELLED, EXPIRED), `billingCycle` (MONTHLY, YEARLY), `startDate`, `nextRenewalDate`, `price` (optional override from catalog price).

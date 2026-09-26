# Phase 19: Party Ledger & Statements - Context

## Locked Decisions

1. **Ledger Logic (Aggregation)**:
   - The Party Ledger will be derived dynamically by aggregating existing Invoices and Payments for a given client (`companyId`).
   - We will not introduce manual journal entries (custom debits/credits) at this time. The ledger strictly reflects standard billing events.

2. **Statement Generation**:
   - Statements will be generated "on the fly" rather than relying on an automated end-of-month cron job.
   - The user will select a client and a Date Range (e.g., Jan 1 - Jan 31). The system will compute the Opening Balance, chronologically list all transactions (Invoices and Payments) within the range, and compute the Closing Balance.
   - We will need a way to persistently store these generated statement links so they can be shared, or compute them entirely dynamically via the URL parameters. To ensure data immutability and simple sharing, we will introduce a `statements` table that saves the exact parameters/snapshot of the generated statement.

3. **Public Statement Links**:
   - Similar to Invoices and Quotes, generated Statements will have a secure, un-guessable public UUID link (e.g., `/public/statement/{uuid}`).
   - The client can view the statement online and download it as a PDF (reusing our `react-to-print` setup).

## Deferred / Out of Scope
- Automated scheduled statement generation and dispatch via email.

## Additional Decisions
4. **UI Location**: The Party Ledger and statement generation will reside inside the existing Client/Company detail view, specifically under a new tab: `/crm/companies/[id]`.
5. **Date Range**: We will provide a manual date range picker with convenient presets (e.g., Last Month, YTD) when generating a statement.
6. **Data Immutability**: Generated statements will be frozen snapshots. The `transactions` JSONB column in the `statements` table will store the historical ledger exactly as it was when generated, ensuring past statements never retroactively change even if underlying invoices/payments are modified later.

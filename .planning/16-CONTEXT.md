# Phase 16: Document Management & Workflows - Context

## Locked Decisions

1. **Edit vs. Revise Workflow**:
   - **Edit**: Modifies the document directly. This is only allowed for documents that are still in a `DRAFT` state.
   - **Revise**: Clones an existing document (e.g., one that is `SENT`, `ACCEPTED`, or `LOCKED`) into a new draft version (e.g., Quote v2). The original document is preserved for historical accuracy.

2. **Quote to Invoice Conversion**:
   - A 1-click "Convert to Invoice" action will be available on Quotes.
   - This action will clone the Quote's line items, totals, and client data directly into a new Draft Invoice.
   - The Invoice will reference the original `quoteId` in the schema for traceability.

3. **Proforma Invoices**:
   - "Proforma Invoice" will be treated as a distinct document state/type in the `invoices` table with a special status `PROFORMA`.
   - It acts as a preliminary bill of sale but won't be counted as realized revenue until finalized.

4. **Data Tables**:
   - We will use standard Shadcn UI Tables (simple, clean, easy to build) for the Quotes and Invoices list views.

5. **Revision Versioning**:
   - When a user clicks "Revise" on a Quote or Invoice, we will add an internal `version` column to the DB schema (defaulting to 1). The cloned revision will have `version: 2`.
   - When rendering the display Quote/Invoice Number, we will append `-v2` (e.g., `QT-2026-001-v2`).

## Deferred / Out of Scope (For this phase)
- **Public Document Links**: Building the unauthenticated client viewing portal is deferred to Phase 17.
- **Payments & Receipts**: Logging partial/full payments against these invoices is deferred to Phase 18.
- **Client Ledger**: The statement of accounts is deferred to Phase 19.

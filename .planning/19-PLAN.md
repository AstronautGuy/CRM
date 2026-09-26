# Phase 19: Party Ledger & Statements - Execution Plan

## 1. TRPC API for Ledger & Statements
- **Goal**: Implement the aggregation logic for dynamic ledgers and the mutation to freeze statements.
- **Files**:
  - `src/server/api/routers/billing.ts` (or `statements.ts` if new router needed; let's stick to `billing.ts` for consistency)
- **Actions**:
  - Create `getLedger` query:
    - Input: `companyId`, `startDate`, `endDate`.
    - Logic:
      1. Fetch `invoices` for the company where `createdAt < startDate` to sum the total billed.
      2. Fetch `payments` for the company where `paymentDate < startDate` to sum the total paid.
      3. Compute `openingBalance` = (Total Billed) - (Total Paid).
      4. Fetch `invoices` within `[startDate, endDate]` (Debits).
      5. Fetch `payments` within `[startDate, endDate]` (Credits).
      6. Combine and sort them chronologically to create an array of `LedgerTransaction` objects.
      7. Compute the `closingBalance`.
      8. Return `{ openingBalance, closingBalance, transactions }`.
  - Create `generateStatement` mutation:
    - Input: `companyId`, `startDate`, `endDate`.
    - Logic:
      1. Call the exact same logic as `getLedger` to get the snapshot data.
      2. Generate a sequential `statementNumber` (like invoices/quotes).
      3. Insert into the `statements` table with the frozen `transactions` JSONB.
      4. Return the inserted statement.
  - Create `getStatementsByCompany` query:
    - Input: `companyId`.
    - Returns a list of generated statements for the UI.

## 2. CRM UI: Ledger Tab
- **Goal**: Add the ledger view and statement generation tools to the client detail page.
- **Files**:
  - `src/app/crm/companies/[id]/page.tsx`
  - `src/components/billing/ledger-view.tsx` (New)
- **Actions**:
  - Refactor `src/app/crm/companies/[id]/page.tsx` to use Shadcn `Tabs` (e.g., "Overview", "Ledger").
  - Build `LedgerView` component:
    - Include a Date Range Picker with presets (Last Month, Last 3 Months, YTD).
    - Call `api.billing.getLedger` and display the results in a running balance table.
    - Add a "Generate Official Statement" button that calls `generateStatement` and toasts success with a link to view it.
    - Below the dynamic ledger, display a table of past generated statements (using `getStatementsByCompany`) with links to copy their public URL or view them.

## 3. Public Statement UI
- **Goal**: Provide the secure public page for clients to view and download their frozen statement.
- **Files**:
  - `src/app/public/statement/[id]/page.tsx` (New)
  - `src/components/public/document-viewer.tsx`
- **Actions**:
  - Create the Next.js page for the statement, fetching data via the existing `getPublicStatement` TRPC endpoint.
  - Pass the statement data into the `DocumentViewer`.
  - Update `DocumentViewer` to support `type === "statement"`. It should render:
    - The Statement Number and Date Range.
    - A summary row showing the `Opening Balance`.
    - The chronologically ordered transactions table (from the JSONB array).
    - A summary row showing the `Closing Balance`.
  - Ensure the existing "Download PDF" logic correctly captures the statement view.

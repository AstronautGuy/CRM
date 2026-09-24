# Phase 18: Payments & Receipts - Execution Plan

## 1. Database Schema Update
- **Goal**: Formalize the payment method constraint.
- **Files**:
  - `src/server/db/schema.ts`
- **Actions**:
  - Create a new PostgreSQL Enum `paymentMethodEnum` with values: `"BANK_TRANSFER"`, `"CREDIT_CARD"`, `"CASH"`, `"CHECK"`.
  - Update the `paymentMethod` column on the `payments` table to use this enum instead of `varchar`.
  - Add relations from `payments` to `invoices` and `organizations` so they can be eagerly loaded.
  - Run `db:generate` and `db:push` to apply the changes.

## 2. TRPC API for Payments
- **Goal**: Build the backend logic for recording and voiding payments.
- **Files**:
  - `src/server/api/routers/billing.ts`
- **Actions**:
  - Create `recordPayment` mutation:
    - Input: `invoiceId`, `amount`, `paymentDate`, `paymentMethod`, `referenceNumber`, `notes`.
    - Logic: 
      1. Insert into `payments`.
      2. Decrement `balanceDue` on the invoice by the `amount`.
      3. If `balanceDue` <= 0, update the invoice status to `PAID`.
      4. Trigger email receipt (Step 3).
  - Create `voidPayment` mutation:
    - Input: `paymentId`.
    - Logic:
      1. Fetch payment and its amount.
      2. Delete the payment record.
      3. Increment `balanceDue` on the invoice by the voided amount.
      4. If the invoice was `PAID` but balance is now > 0, revert status back to `SENT`.
  - Create `getPaymentsByInvoice` query to list all payments for a specific invoice.

## 3. Email Receipt Automation
- **Goal**: Automatically email the client when a payment is logged.
- **Files**:
  - `src/server/api/routers/billing.ts`
  - `src/server/notifications/email.ts` (or similar utility)
- **Actions**:
  - When a payment is successfully inserted via `recordPayment`, construct a "Payment Received" payload.
  - The email should summarize the amount paid, payment date, method, and the remaining `balanceDue`.
  - Send the email to the client's `contactEmail`.

## 4. Payment UI (CRM Side)
- **Goal**: Allow Tenant Admins to log and view payments in the dashboard.
- **Files**:
  - `src/components/billing/record-payment-dialog.tsx` (New)
  - `src/app/billing/invoices/page.tsx`
- **Actions**:
  - Create `RecordPaymentDialog` containing a form (Amount, Date, Method Select, Reference, Notes).
  - Wire this dialog up to the "Record Payment" DropdownMenuItem we saw in the invoices table.
  - Update the data table row expansion (or create a dedicated detail page/modal) to list the payment history for an invoice, including a "Void" button next to each payment that calls `voidPayment`.

## 5. Public Invoice View Update
- **Goal**: Show the end-customer their payment history on the public invoice view.
- **Files**:
  - `src/server/api/routers/public.ts`
  - `src/components/public/document-viewer.tsx`
- **Actions**:
  - Update `getPublicInvoice` to eagerly load `payments` (`with: { payments: true }`).
  - In `DocumentViewer`, if `payments.length > 0`, render a "Payment History" section at the bottom of the invoice showing Date, Method, Amount, and the remaining Balance Due. This doubles as the digital receipt!

# Phase 18: Payments & Receipts - Context

## Locked Decisions

1. **Payment Gateway Integration**:
   - We will focus exclusively on **manual payment recording** for this phase (logging offline payments like bank transfers, cash, or external checks).
   - Stripe/Razorpay integration is deferred to a future phase. The "Pay Now" button on public invoices will either be hidden or set to display payment instructions (e.g., bank details).

2. **Partial Payments & Balances**:
   - We will support partial payments.
   - We will introduce a new `payments` table linked to an `invoiceId`.
   - Invoices will dynamically calculate (or track) `amountPaid` and `balanceDue`.
   - When `balanceDue` reaches $0, the invoice status automatically updates to `PAID`.

3. **Receipt Generation**:
   - We will not create a completely separate "Receipt" document type/numbering system.
   - Instead, the **Invoice acts as the Receipt**.
   - The public invoice view will be updated to display a "Payment History / Logs" section, showing the dates and amounts of received payments.
   - A final "Receipt" is simply the Invoice explicitly marked as `PAID` with a $0 balance, which is sent to the client after full payment.

## Deferred / Out of Scope
- Automatic payment capturing via Stripe / Razorpay API.

## Additional Decisions
4. **Email Receipts**: Recording a payment will automatically trigger an email receipt to the client.
5. **Payment Methods**: We will use a fixed Enum list for payment methods (`BANK_TRANSFER`, `CREDIT_CARD`, `CASH`, `CHECK`).
6. **Mistakes/Corrections**: For the MVP, we will allow Tenant Admins to delete/void payments to reverse them, rather than requiring an append-only refund entry.

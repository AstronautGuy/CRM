# Phase 17 UAT (User Acceptance Testing)

## Test Scenarios

### 1. Secure Public URLs
- [ ] In the UI, locate a Quote that is **NOT** in DRAFT status (or change its status in the DB).
- [ ] Copy the Quote's UUID (from the DB or URL).
- [ ] Open an incognito window (unauthenticated).
- [ ] Navigate to `/public/quote/[UUID]`.
- [ ] Verify the Quote renders correctly.
- [ ] Repeat the above steps for an Invoice that is **NOT** in DRAFT status at `/public/invoice/[UUID]`.

### 2. Draft Security
- [ ] Find or create a Quote/Invoice that is in **DRAFT** status.
- [ ] Navigate to its public URL in an incognito window.
- [ ] Verify that access is denied (you should see an error message stating it is not available for public viewing).

### 3. Document Viewer UI
- [ ] On a public document page, verify that the organization logo (or name) and client details are displayed correctly.
- [ ] Verify that line items are listed with correct pricing and totals.
- [ ] Verify that notes, terms, and signatures (if any) are displayed properly.
- [ ] For Invoices, verify that if `amountPaid` > 0, the "Amount Paid" and "Balance Due" are calculated and displayed correctly.

### 4. PDF Generation & Printing
- [ ] Click the "Print / Save PDF" button on the public view.
- [ ] Verify that the browser's native print dialog opens.
- [ ] Verify that the preview looks clean (styled properly, fits well on the page without massive margins, and doesn't print the actual "Print / Save PDF" button itself).

## Sign-Off
Once verified, report any issues here or confirm completion so we can mark Phase 17 as complete.

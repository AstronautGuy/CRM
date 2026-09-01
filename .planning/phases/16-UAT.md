# Phase 16 UAT (User Acceptance Testing)

## Test Scenarios

### 1. Document Numbering and Revision Strategy
- [ ] Create a Quote and note its generated Quote Number (e.g., `EST-001`).
- [ ] Use the "Revise (Clone)" action on the quote.
- [ ] Verify that a new draft quote is created and listed in the data table.
- [ ] Verify the new quote displays as `EST-001-v2` in the UI.

### 2. Convert Quote to Invoice
- [ ] On a Quote, select "Convert to Invoice".
- [ ] Verify that you are redirected to the Invoices list.
- [ ] Verify that a new Invoice has been created and is linked to the original quote (the totals should match).
- [ ] If you edit the invoice (or view it in the database), verify that the quote's contents (line items, terms, notes, tax percentages, labels, custom fields, etc.) were successfully copied over to the Invoice record.

### 3. Invoice Revision Strategy
- [ ] On an Invoice, select "Revise (Clone)".
- [ ] Verify that a new draft invoice is created and listed in the data table.
- [ ] Verify the new invoice displays as `INV-XXX-v2` in the UI, keeping the same base number.

## Sign-Off
Once verified, report any issues here or confirm completion so we can mark Phase 16 as complete.

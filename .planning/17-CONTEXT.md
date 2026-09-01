# Phase 17: Public Document Links & PDFs - Context

## Locked Decisions

1. **Public URLs**: 
   - We will use the existing cryptographically secure UUIDs for the public URLs (e.g., `/public/invoice/{uuid}` and `/public/quote/{uuid}`). They are sufficiently random and impossible to guess.
   - We will not create an additional `publicToken` column.

2. **Access Control (Drafts)**:
   - Public links will **NOT** be accessible if the document is in a `DRAFT` state. 
   - Attempting to view a Draft via the public link will return a 404 or a user-friendly "Document Not Ready" screen.

3. **PDF Generation**:
   - We will use a client-side library approach (e.g., `react-to-print` or `html2pdf.js`) for generating the PDFs directly in the browser when the user clicks "Download as PDF".
   - This keeps the hosting requirements lightweight and avoids the need for a headless browser server.

## Deferred / Out of Scope (For this phase)
- **Payments**: Integrating payment gateway buttons (Stripe/Razorpay) onto the public view page is deferred until Phase 18 (Payments & Receipts).

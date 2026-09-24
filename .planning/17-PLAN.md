# Phase 17: Public Document Links & PDFs - Execution Plan

## 1. Public TRPC Routes for Documents
- **Goal**: Allow fetching of Quote and Invoice data securely without user authentication, purely based on their UUIDs (only if they are not drafts).
- **Files**:
  - `src/server/api/routers/public.ts` (New)
  - `src/server/api/root.ts`
- **Actions**:
  - Create a new TRPC router `public` with `publicProcedure`s.
  - Implement `getInvoiceByParams: publicProcedure.input(z.object({ id: z.string().uuid() }))`. It should query the database for the invoice using the provided UUID.
  - Implement `getQuoteByParams: publicProcedure.input(z.object({ id: z.string().uuid() }))`.
  - **Security Gate**: In both queries, if the document's status is `DRAFT`, throw a `TRPCError({ code: "NOT_FOUND", message: "Document Not Ready" })`.
  - Add the `public` router to `root.ts`.

## 2. Public View Pages (App Router)
- **Goal**: Create the actual frontend pages for the client to view the documents without logging in.
- **Files**:
  - `src/app/public/layout.tsx` (New)
  - `src/app/public/invoice/[id]/page.tsx` (New)
  - `src/app/public/quote/[id]/page.tsx` (New)
- **Actions**:
  - Create `public/layout.tsx` - a minimal layout without the sidebar/navigation (since clients won't be logged in). Use a clean, branded header.
  - Create the `invoice/[id]/page.tsx` that fetches data using `api.public.getInvoiceByParams`.
    - If error/404, show a friendly "Document Not Ready or Not Found" state.
    - If success, render the invoice details beautifully (Company Info, Client Info, Line Items, Totals, Status Badge).
  - Create the `quote/[id]/page.tsx` mirroring the invoice layout but for Quotes.

## 3. Client-Side PDF Generation
- **Goal**: Allow the viewer to download the document as a PDF using client-side rendering.
- **Files**:
  - `package.json`
  - `src/components/public/document-viewer.tsx` (New/Refactored)
- **Actions**:
  - Install a client-side PDF library such as `html2pdf.js` or `react-to-print` (e.g. `npm install html2pdf.js` or use raw window.print with CSS print media queries as the absolute simplest approach if preferred).
  - Add a "Download PDF" button to the public document views.
  - Implement the click handler that converts the specific DOM element (the invoice/quote sheet) into a PDF and triggers a browser download. Ensure the generated PDF is styled cleanly (hide buttons in the print/PDF view).

## 4. UI Entry Points from CRM
- **Goal**: Allow the CRM users (Tenants) to easily grab the public link and send it to their clients.
- **Files**:
  - `src/app/dashboard/invoices/[id]/page.tsx` (Assuming this exists)
  - `src/app/dashboard/quotes/[id]/page.tsx` (Assuming this exists)
- **Actions**:
  - In the CRM's internal view for an Invoice or Quote, add a "Copy Public Link" button.
  - The button should reconstruct the full URL (e.g., `window.location.origin + "/public/invoice/" + invoice.id`) and write it to the clipboard using `navigator.clipboard.writeText`.
  - Show a toast notification on success.
  - If the document is `DRAFT`, disable the "Copy Public Link" button and show a tooltip ("Must be finalized/sent before sharing").

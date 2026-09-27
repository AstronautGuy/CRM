# Phase 31: Empty States & Contextual Help - Plan

## Step 1: Create Global Empty State Component
- Create `src/components/ui/empty-state.tsx`.
- Component props: `title`, `description`, `icon` (Lucide), `action` (optional element like a Link wrapped in a Button).
- Styling: Centered flex layout, muted foreground text, subtle background borders.

## Step 2: Integrate Tooltips
- Create `src/components/ui/tooltip-info.tsx` (a small wrapper around the Tooltip primitive).
- Component `InfoTooltip` with props `content`. Renders a small `( ? )` or `Info` icon that shows the tooltip on hover.
- *Wait for shadcn `tooltip` installation to complete before using it.*

## Step 3: Update Main Feature Pages
- **CRM Leads (`src/app/dashboard/crm/page.tsx`)**:
  - Add `EmptyState` when `leads.length === 0`.
  - Add `InfoTooltip` next to table headers like "Lead Status" or "Value".
- **Catalog Products (`src/app/dashboard/catalog/page.tsx`)**:
  - Add `EmptyState` when `products.length === 0`.
  - Add `InfoTooltip` next to "SKU" or "Price Type".
- **Invoices (`src/app/dashboard/invoices/page.tsx`)**:
  - Add `EmptyState` when `invoices.length === 0`.
  - Add `InfoTooltip` next to "Balance Due" or "Status".

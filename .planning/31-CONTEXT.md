# Phase 31: Empty States & Contextual Help - Context

## Objective
Design and implement beautiful, actionable empty states for all main feature tables (CRM, Invoices, Products) when no data exists. Add informational tooltips to complex form fields and table headers to explain industry-specific terminology.

## Requirements
- **Global Empty States**: Replace raw "No data" messages with an `EmptyState` component that includes an icon, title, description, and an action button (e.g. "Create your first lead").
- **Contextual Tooltips**: Implement `radix-ui/react-tooltip` or a custom `Tooltip` component to add `(?)` hover elements on complex terms.

## Files to Modify/Create
- `src/components/ui/empty-state.tsx` (New shared component)
- `src/components/ui/tooltip.tsx` (Ensure it exists and works)
- `src/app/dashboard/crm/page.tsx` (Empty state for CRM leads)
- `src/app/dashboard/catalog/page.tsx` (Empty state for Products)
- `src/app/dashboard/invoices/page.tsx` (Empty state for Invoices)

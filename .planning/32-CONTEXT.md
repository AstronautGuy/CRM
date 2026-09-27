# Phase 32: Interactive Guided Tour - Context

## Objective
Integrate an interactive guided tour using a library like `driver.js` to provide a walkthrough for new users on core feature pages (e.g., how to create a lead, how to create a quote).

## Requirements
- Install `driver.js`.
- Create a global tour context or a custom hook `useTour`.
- Add a "Take a Tour" button or auto-trigger a tour on specific pages for the first time.
- Key tours:
  - **Dashboard Tour**: Highlight metrics, navigation, and settings.
  - **CRM Tour**: Highlight "Add Client" button, search filter, and list.

## Files to Modify/Create
- `src/components/providers/tour-provider.tsx` (Context provider for the tour, if needed, or just a helper file)
- `src/app/dashboard/page.tsx` (Add tour steps)
- `src/app/clients/page.tsx` (Add tour steps)
- Update `package.json` with `driver.js`.

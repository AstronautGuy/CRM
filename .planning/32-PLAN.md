# Phase 32: Interactive Guided Tour - Plan

## Step 1: Create Tour Hook
- Create `src/hooks/use-tour.tsx` that exports a hook initializing `driver.js`.
- Provide predefined configurations for the tours (e.g., `dashboardTourSteps`, `crmTourSteps`).

## Step 2: Implement Dashboard Tour
- In `src/app/dashboard/page.tsx`, add an ID `tour-checklist` to the `SetupChecklist`.
- Add ID `tour-customize` to the "Customize Layout" button.
- Add a "Take a Tour" button in the header that triggers the driver.js tour across these elements.

## Step 3: Implement CRM Tour
- In `src/app/clients/page.tsx`, add IDs like `tour-add-client`, `tour-search`.
- Add a "Tour this page" button that runs the step-by-step CRM tour.

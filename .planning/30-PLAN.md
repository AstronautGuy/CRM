# Phase 30: Welcome Flow & Setup Checklist - Plan

## Step 1: Database Updates
- Modify `src/server/db/schema.ts`:
  - Add `hasSeenWelcome` boolean column to the `users` table, defaulting to `false`.
- Create a Drizzle migration script in `scripts/` to execute `ALTER TABLE devcrm_user ADD COLUMN "hasSeenWelcome" boolean DEFAULT false NOT NULL;`.
- Update `src/server/api/routers/user.ts` (or similar router) to add a mutation `markWelcomeSeen` and a query `getSetupProgress`.

## Step 2: `getSetupProgress` TRPC Query
- In `src/server/api/routers/user.ts`, add `getSetupProgress` which returns:
  - `hasSeenWelcome` (boolean)
  - `onboardingComplete` (boolean)
  - `steps`: array of tasks:
    1. "Profile Complete": check if `user.name` and `user.phone` are present.
    2. "First Product Created": query `products` for `organizationId`.
    3. "First Lead Created": query `crm_leads` for `organizationId`.

## Step 3: UI - Welcome Modal
- Create `src/app/dashboard/_components/WelcomeModal.tsx` which uses `Dialog` from Radix.
- When `hasSeenWelcome` is false, it automatically opens.
- When closed, calls `markWelcomeSeen` mutation to prevent it from showing again.

## Step 4: UI - Setup Checklist Widget
- Create `src/app/dashboard/_components/SetupChecklist.tsx`.
- Displays a small card/widget on the dashboard with the 3 steps.
- If all steps are complete, displays a celebration message and sets `onboardingComplete=true` (maybe via another mutation).

## Step 5: Dashboard Integration
- Import `WelcomeModal` and `SetupChecklist` into `src/app/dashboard/page.tsx` or `src/app/dashboard/layout.tsx`.

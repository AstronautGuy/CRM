# Phase 30: Welcome Flow & Setup Checklist - Context

## Objective
Implement a welcome modal upon first login and a persistent setup checklist widget on the dashboard to guide new users through their initial platform setup (completing profile, adding a product, creating a lead).

## Requirements
- **Welcome Modal**: Displayed on first login. Welcomes the user.
- **Setup Checklist**: A dashboard widget displaying progress out of N essential tasks.
- **State Tracking**: Track whether the user has seen the welcome modal, and track their checklist progress. We need a way to store this. We can use a `userSettings` or similar table, or derive checklist progress dynamically from database queries (e.g. checking if a product exists for the organization).

## Key Files to Modify/Create
- `src/server/db/schema.ts` (Add `onboardingComplete` or `hasSeenWelcome` to `user` or `organization` if not present)
- `src/server/api/routers/user.ts` or `onboarding.ts` (For updating state)
- `src/app/dashboard/page.tsx` (To display the checklist and welcome modal)
- UI Components: `WelcomeModal.tsx`, `SetupChecklist.tsx`

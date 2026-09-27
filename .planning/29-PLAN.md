# Phase 29: Build Fixes & Vercel Configuration - Plan

## Step 1: Fix TypeScript Errors
- Identify the error in `scripts/alter-orgs.cjs`. The error is that TypeScript features (like non-null assertions and type annotations) are used in a `.cjs` (CommonJS) file.
- Solution: Either rename the file to `.ts` (since it contains TypeScript), or remove the TypeScript syntax from the `.cjs` file. Given our other scripts are `.ts`, we will rename `scripts/alter-orgs.cjs` to `scripts/alter-orgs.ts`.

## Step 2: Test Next.js Build
- Run `npm run build` locally to verify that Turbopack and Next.js can compile all pages and routes successfully without throwing environment or type errors.

## Step 3: Vercel Configuration
- Since T3 Stack projects generally deploy flawlessly on Vercel without a `vercel.json` file, we only need one if we want specific overrides (like caching or build commands). We will leave it to the Vercel default but verify the `build` script in `package.json` is `next build`.

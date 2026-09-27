# Phase 29: Build Fixes & Vercel Configuration - Context

## Objective
Fix any outstanding TypeScript build errors that will block a successful deployment (specifically identifying the `.cjs` script issues), and configure Vercel settings if needed.

## Scope
1. **TypeScript Build**:
   - Run `tsc --noEmit` and fix errors (such as non-null assertions and type annotations in `.cjs` files, likely in `scripts/alter-orgs.cjs`).
2. **Vercel Configuration**:
   - Add a `vercel.json` file if required for routing or install overrides, though Next.js generally handles this out-of-the-box. We'll at least verify there are no missing Vercel config files.

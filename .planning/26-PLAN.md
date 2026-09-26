# Phase 26: Super Admin Infrastructure & Health Metrics - Plan

## Step 1: Database Schema Updates
- **`src/server/db/schema.ts`**:
  - Update `users` table: add `role` column (`varchar("role", { length: 50 }).default("USER")`). (Alternatively, create a Postgres enum for `user_role` with `USER` and `SUPER_ADMIN`). I will just use `varchar` for simplicity and lack of enum migration pain.

## Step 2: TRPC Middleware for Super Admin
- **`src/server/api/trpc.ts`**:
  - Create a new procedure `superadminProcedure` that extends `protectedProcedure` but checks if `ctx.session.user.role === 'SUPER_ADMIN'`. (I need to ensure `next-auth.d.ts` extends `User` to include `role`).

## Step 3: Superadmin Router
- **`src/server/api/routers/superadmin.ts`**:
  - We already have an import for `superadminRouter` in `root.ts` but it might be empty or missing.
  - Implement `superadminRouter` with a `getPlatformHealth` query.
  - Calculate:
    - Total Organizations (`organizations` count).
    - Total Users (`users` count).
    - Global Revenue (Sum of `amount` in `payments` across all orgs).
    - Mock System Error Rate / CPU load to look cool on the dashboard.

## Step 4: Superadmin Next.js Pages
- **`src/app/superadmin/layout.tsx`**:
  - Secure the layout so that only `SUPER_ADMIN` can view it. Redirect others to `/dashboard`.
- **`src/app/superadmin/page.tsx`**:
  - A beautiful overview dashboard containing metric cards.
  - Sidebar/Nav that links to "Overview" and "Tenants".

## Step 5: Execute & Verify
- Migrate DB.
- Set my own user to `SUPER_ADMIN` in the database.
- Load the `/superadmin` page and check the network tab / console for errors.

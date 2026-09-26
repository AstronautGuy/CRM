# Phase 24: Catalogues & Ads - Plan

## Step 1: Database Updates
- **`src/server/db/schema.ts`**:
  - Add `isPublic: d.boolean().default(false).notNull()` to `products`.
  - Add `adCampaignId: d.varchar({ length: 255 }).references(() => adCampaigns.id, { onDelete: "set null" })` to `contacts`.
- Run Drizzle migrations.

## Step 2: Public Catalogue Storefront
- **`src/app/c/[orgId]/page.tsx`**: Create a public layout and page that fetches the organization's public products.
- Display products in a responsive grid.
- Implement a basic "Add to Quote Request" shopping cart state in the client.
- Add a "Submit Request" form taking the visitor's Name, Email, and Phone.
- **`src/server/api/routers/public.ts`** (or new public TRPC router):
  - `submitQuoteRequest`: Takes the cart items and visitor details. Creates a Contact (if email doesn't exist in org) and generates a Quote linked to the Contact in `DRAFT` status, notifying the org via `notifications` table.

## Step 3: Admin Products Management Update
- **`src/app/inventory/products/page.tsx`** (or wherever products are managed): Add a toggle column/action for `isPublic`. Update TRPC mutation to handle it.

## Step 4: Ad Campaigns & ROAS UI
- **`src/app/marketing/ads/page.tsx`**:
  - Display existing `adCampaigns`.
  - For each campaign, show Spend vs. Conversions vs. Generated Contacts.
- **`src/app/api/webhooks/ads/route.ts`**:
  - A mock webhook POST route that takes an `adCampaignId` and dummy lead data (name, email) and automatically inserts them into `contacts` with the respective `adCampaignId`.

## Step 5: Verification & Typecheck
- Validate the public catalogue routes properly without auth.
- Confirm TRPC correctly processes the cart into a Quote.
- Check typescript compilation.

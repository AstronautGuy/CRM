# Phase 24: Catalogues & Ads - Summary

## What Was Done
1. **Database Schema:** Added `isPublic` flag to `products` table and `adCampaignId` to `contacts` table. Ran migrations to apply changes to the DB.
2. **Public Catalogue Storefront:** Created a dynamic route at `/c/[orgId]/page.tsx` that allows unauthenticated users to view public products for an organization.
3. **Quote Requests:** Built an interactive shopping cart in the public catalogue that lets users add items and submit a quote request (which creates a Contact and a Quote in `REQUESTED` status, and triggers a Notification to Org members). Added `getCatalogue` and `submitQuoteRequest` to `publicRouter`.
4. **Ad Campaigns Webhook:** Implemented a mock webhook endpoint at `/api/webhooks/ads/route.ts` that ingests leads from an ad campaign, links them to `contacts`, and increments the campaign conversions to demonstrate ROAS.
5. **Ads Dashboard:** Created `/marketing/ads/page.tsx` using `api.marketing.getCampaigns` to display campaign ROI, CPL, and leads generated.
6. **Product Admin Toggle:** Added a "Visible in Public Catalogue" toggle in the `inventory` dashboard when creating/editing products.

## How to Test
1. Visit `/inventory/products`, edit a product, and check the "Visible in Public Catalogue" box.
2. Open a private window to `/c/<your-org-id>` and see the public product.
3. Add the product to the cart and submit a request.
4. Go back to `/crm/quotes` to see the newly generated draft quote.
5. Visit `/marketing/ads` to connect an ad campaign, then simulate a webhook POST to `/api/webhooks/ads` with the campaign ID.

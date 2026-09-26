# Phase 24: Catalogues & Ads - Verification

- [x] **Schema Changes:** `isPublic` on products and `adCampaignId` on contacts implemented. Migrations pushed.
- [x] **Public Route:** Created `/c/[orgId]/page.tsx` for viewing public products and submitting quotes.
- [x] **Public TRPC:** `getCatalogue` and `submitQuoteRequest` built in `publicRouter.ts` using TRPC without authentication.
- [x] **Admin Products:** The `/inventory/products` dashboard allows setting `isPublic` explicitly using a UI checkbox.
- [x] **Ads Webhook:** POST route at `/api/webhooks/ads` successfully ingests dummy lead payloads and links them to ad campaigns, updating CPL in real-time.
- [x] **Ads UI:** Admin page `/marketing/ads` uses client-side queries to list active campaigns, tracking clicks and ROI.
- [x] **Typescript:** Code compiles without error in the newly added files.

All tasks for Phase 24 are verified complete.

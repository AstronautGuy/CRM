# Phase 24: Catalogues & Ads - Context

## Objective
Enable Tenant Admins to expose a public catalogue of their products/services to external users. Allow these users to browse and request quotes directly. Additionally, integrate a mock framework for ingesting leads from Ad Campaigns (Meta/Google) and linking them to CRM contacts/deals for ROAS computation.

## Technical Scope
1. **Database Additions:**
   - Update `products` table to add an `isPublic` boolean flag.
   - Ensure `adCampaigns` is properly linked. (Wait, `adCampaigns` exists but needs to link leads or deals to campaigns. We should add `sourceCampaignId` to `contacts` or `deals`? `contacts` already has a `source` field. We can add an `adCampaignId` to `contacts`).
2. **Public Catalogue UI:**
   - Create a dynamic route `/c/[orgId]` or similar that serves a public storefront.
   - The storefront fetches products with `isPublic = true`.
   - A basic "Cart" or "Quote Request" form that submits to a TRPC endpoint and creates a `Quote` in `DRAFT` or `REQUESTED` state in the CRM.
3. **Ads Integration UI:**
   - Create an Admin UI under `/marketing/ads` to list `adCampaigns` and show spend vs. generated contacts (ROAS).
   - Mock a webhook receiver that creates a Contact from an Ad Campaign.

## Assumptions
- We will mock the Ad provider webhook with a simple TRPC mutation or API route (`/api/webhooks/ads`) to demonstrate lead ingestion without needing real Meta/Google Developer accounts.
- The Public Catalogue can just be a Next.js App Router dynamic route.

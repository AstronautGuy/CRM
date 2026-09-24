# Phase 27: Outbound Webhooks System (Verified)

## Implementation Summary
- Integrated the `svix` package for webhook dispatching and configured `SVIX_TOKEN` in environment variables.
- Added `svixAppId` to the `organizations` table to map DevCRM organizations to their Svix Application equivalents.
- Created `webhooksRouter` to automatically provision a Svix Application upon the user's first visit to the webhook settings and generate an App Portal magic link.
- Built the UI at `/settings/webhooks` which successfully embeds the Svix App Portal via an iframe.
- Created `dispatchWebhook` utility to dispatch events securely without failing the main process if a webhook dispatch errors out.
- Wired up webhook dispatches across the codebase for core events: `client.added`, `company.added`, `invoice.created`, `invoice.payment_recorded`, and `invoice.paid`.

## Verification
- [x] Database migration succeeded and `svixAppId` is tracked.
- [x] Environment validation accepts the Svix configuration token.
- [x] Webhooks settings UI loads the portal correctly.
- [x] Event triggers properly await the `dispatchWebhook` helper and fail gracefully if no application is registered.

## Next Steps
The milestone "Public API & Webhooks" is now feature complete (Phase 26 + Phase 27). The project is ready for Milestone 5 audit.

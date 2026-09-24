# DevCRM - Requirements (Milestone 5)

## Milestone 5: Public API & Webhooks

### 1. API Authentication & Key Management
- [x] Users can generate, revoke, and manage API keys from their settings page.
- [x] API routes must be protected using these API keys.
- [x] Rate limiting applied to API key usage. *(Deferred: marked as Technical Debt)*

### 2. Outbound Webhooks System
- [x] UI for users to configure webhook endpoints and subscribe to events (e.g., `invoice.created`, `payment.received`).
- [x] System to queue and dispatch webhook payloads when events occur.
- [x] Webhook delivery history and retry mechanisms.

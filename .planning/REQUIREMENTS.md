# DevCRM - Requirements

## Milestone 5: Public API & Webhooks

### 1. API Authentication & Key Management
- [ ] Users can generate, revoke, and manage API keys from their settings page.
- [ ] API routes must be protected using these API keys.
- [ ] Rate limiting applied to API key usage.

### 2. Outbound Webhooks System
- [ ] UI for users to configure webhook endpoints and subscribe to events (e.g., `invoice.created`, `payment.received`).
- [ ] System to queue and dispatch webhook payloads when events occur.
- [ ] Webhook delivery history and retry mechanisms.

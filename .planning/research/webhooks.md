# Research: Outbound Webhooks System

## Decisions Made
1. **Infrastructure**: We will integrate a specialized service (like [Svix](https://www.svix.com/)) instead of building our own queue/retry mechanism. This offloads the complexity of exponential backoffs, dead letter queues, and delivery history UI.
2. **Security**: We will implement payload signing (HMAC). By using a service like Svix, webhook signatures (`svix-id`, `svix-timestamp`, `svix-signature`) are handled automatically, allowing clients to verify payloads securely.
3. **Event Scope**: "Auto" — We will map standard core events automatically (e.g., `invoice.created`, `invoice.paid`, `client.added`). We can define a standard schema for these event payloads.

## Impact on Phase 27
- **Database**: We won't need tables for `webhook_deliveries` or `webhook_endpoints` if we fully rely on Svix's App portal, but we may want to store a `svixAppId` on the `organizations` table.
- **UI**: We can use the pre-built Svix App Portal UI component in our dashboard, so users can configure their endpoints directly.
- **Backend**: We just need a helper utility (e.g., `svix.message.create`) that fires off the payload to Svix whenever a core domain action occurs.

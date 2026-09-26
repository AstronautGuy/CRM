# Phase 23: Reminders & Automations - Context

## Locked Decisions

1. **Automation Engine Architecture**: We will expose a secure API route (e.g., `/api/cron/process-automations`) that iterates through active rules and processes them. This ensures compatibility with serverless environments (like Vercel) where an external cron service can reliably ping the endpoint on a schedule (e.g., hourly).
2. **Drip Campaign & Rule Complexity**: For the initial release, we will stick to single-step scheduled rules to keep the UX clean and the engine reliable. Example: "Send 'Follow-up' email 3 days after Quote status changes to Sent." We will avoid multi-step visual workflow builders (Wait -> Condition -> Action) for now.
3. **Email Dispatch**: We will mock the actual email dispatching for this phase to focus purely on the automation engine logic, rule processing, and internal state. Sent emails will be logged to the console and stored in a new `communications` (or `sent_emails`) table for visibility in the CRM without requiring active API keys.
4. **Internal Staff Alerts**: Will be implemented as a new notification table/system, triggered by the same cron engine or via event listeners, and displayed in the UI.

## Technical Architecture Thoughts
- We'll need a new database table `automationRules` to store the user-defined logic (Trigger Type, Trigger Condition, Target Entity, Action Payload).
- We'll need a table `automationLogs` to track when an automation was successfully executed on a specific entity to prevent duplicate firing.
- We'll need a `communications` table to store mocked dispatched emails.
- We'll need a `notifications` table to store internal staff alerts.

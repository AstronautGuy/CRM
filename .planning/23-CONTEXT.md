# Phase 23: Reminders & Automations - Context

## Locked Decisions

1. **Scope of Reminders**:
   - The system must support a wide variety of entities: Invoice Reminders, Subscription Renewals, Deal/Pipeline Follow-ups, and Custom Task Reminders.

2. **Delivery Mechanism**:
   - For Phase 23, delivery will be strictly in-app. Reminders and triggered automations will generate notifications or alerts visible directly on the user's Dashboard. External delivery (like automated emails) is deferred to a future iteration.

3. **Automation Rules Engine**:
   - We will not rely solely on hardcoded defaults. Instead, we will provide a full UI for users to build custom automation rules.
   - Users should be able to define trigger conditions (e.g., "3 days before an Invoice is due", "When a Subscription expires") and define the resulting action (e.g., "Create a high-priority dashboard alert", "Create a follow-up task").

## Technical Architecture Thoughts
- We'll need a new database table `devcrm_automation_rule` to store the user-defined logic (Trigger Type, Trigger Condition, Target Entity, Action Payload).
- We'll need a table `devcrm_notification` or `devcrm_reminder` to store the generated alerts that get displayed on the dashboard.
- A background or on-demand evaluation mechanism will be required to check if any rules match current system state (e.g., checking due dates) and generate the appropriate alerts.

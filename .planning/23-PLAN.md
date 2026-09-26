# Phase 23: Reminders & Automations - Execution Plan

## 1. Database Schema Additions
- **Goal**: Introduce the tables necessary for rules, logging, notifications, and communications.
- **Files**: `src/server/db/schema.ts`
- **Actions**:
  - Define `automationRules` table: `id`, `organizationId`, `name`, `triggerType` (Enum: `INVOICE_DUE`, `QUOTE_SENT`), `offsetDays` (int, e.g. -3 for due in 3 days), `actionType` (Enum: `SEND_EMAIL`, `INTERNAL_ALERT`), `actionPayload` (JSON).
  - Define `automationLogs` table: `id`, `organizationId`, `ruleId`, `targetEntityId`, `executedAt`. (Unique constraint on `ruleId` + `targetEntityId`).
  - Define `communications` table: `id`, `organizationId`, `companyId`, `targetEntityId`, `type` (e.g. `EMAIL`), `subject`, `body`, `sentAt`.
  - Define `notifications` table: `id`, `organizationId`, `userId`, `message`, `link`, `isRead` (boolean), `createdAt`.
  - Generate and apply Drizzle migration.

## 2. API Routes & Automation Engine
- **Goal**: Expose the serverless cron endpoint to evaluate rules.
- **Files**: 
  - `src/app/api/cron/process-automations/route.ts` (New)
  - `src/server/api/routers/automations.ts` (New)
  - `src/server/api/root.ts`
- **Actions**:
  - `process-automations` Route:
    - Must be a secure GET/POST endpoint (e.g. checking a secret auth header).
    - Logic: Fetch all `automationRules`.
    - For `INVOICE_DUE`: Find invoices matching the offset conditions (e.g., due in 3 days). Check `automationLogs` to ensure no duplicate firing. 
    - For `QUOTE_SENT`: Find quotes matching offset conditions (e.g., sent 3 days ago).
    - If conditions met:
      - If `actionType === SEND_EMAIL`: Insert into `communications`.
      - If `actionType === INTERNAL_ALERT`: Insert into `notifications` for the org owner/staff.
      - Always insert into `automationLogs`.
  - `automations` TRPC Router:
    - `getRules`, `createRule`, `deleteRule`.
    - `getCommunications`, `getNotifications`, `markNotificationRead`.
    - Wire router into `root.ts`.

## 3. Automations UI Setup
- **Goal**: Build the interfaces for Tenant Admins to manage rules and view logs.
- **Files**:
  - `src/app/crm/automations/page.tsx` (New)
  - `src/components/automations/create-rule-dialog.tsx` (New)
- **Actions**:
  - Create the Automations management page listing all active rules in a data table.
  - Build a Dialog form to create a new rule (Select trigger, offset days, action type, and basic payload like email subject).
  - Add a "Communications" or "Email Logs" tab to view the mocked dispatched emails (data from `communications` table).

## 4. Notifications Bell Integration
- **Goal**: Surface internal staff alerts directly in the application shell.
- **Files**:
  - `src/components/layout/dashboard-layout.tsx` (or top navigation component)
- **Actions**:
  - Integrate a Bell icon into the top right navigation.
  - Query `getNotifications` (filtering for `isRead: false`).
  - Show a dropdown of recent alerts, allowing users to click to navigate to the relevant entity and marking the notification as read.

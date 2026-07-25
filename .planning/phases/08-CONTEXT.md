# Phase 8 Context: Billing & CRM UX Enhancements

## Decisions Made During Discussion

### 1. Create Quote & Invoice Actions
- **Decision**: The "Create Quote" and "Create Invoice" buttons will live in the **Sidebar Navigation** under a new **"Quick Actions"** section. 
- **Implication**: This ensures they are globally accessible across the dashboard and tenant routes, eliminating the need to navigate specifically to the Billing page to initiate these common tasks.

### 2. Streamlining the Contacts Database
- **Decision**: The data entry flow for Contacts (creation and editing) will mirror the layout and UX of the new `/onboarding` page. 
- **Implication**: Instead of cramped modals or basic inline editing, adding/editing a contact will use a spacious, beautiful, full-page (or well-padded) form with strict Zod validation, utilizing high-quality Shadcn UI components (like the custom `PhoneInput`).

## Constraints & Rules
- Continue strict adherence to Next.js App Router RSC/Client boundaries.
- Ensure all forms use `react-hook-form` + `zod` for robust validation.
- Maintain the premium Shadcn dark mode aesthetic across the new Quick Actions and Contacts forms.

## Next Steps
- This context file (`08-CONTEXT.md`) should be read by the planning agent to create a concrete `08-PLAN.md`.
- **Note**: Phase 7 was determined to be already implemented, so we have jumped straight to discussing Phase 8.

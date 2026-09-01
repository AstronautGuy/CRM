# ROADMAP.md - DevCRM

## Milestones & Phases

### Milestone 1: Core Foundation & CRM Essentials (Current)
- [x] **Phase 1: Foundation, Multi-Tenancy & SaaS Subscription Setup**
  - Setup UI design system / component library (Shadcn/Tailwind v4)
  - Implement NextAuth.js authentication (OAuth, Email/Password, Phone/Password)
  - Configure database schema for users, roles, organizations, subscription plans, and tenant subscriptions
  - Super Admin dashboard to manage client companies, pricing plans, and payment records
  - Feature gating middleware based on organization subscription status

- [x] **Phase 2: Customer & Lead Management**
  - Build contact & company database schema & tRPC procedures
  - Develop contact management UI (list, filter, detail view, creation forms)
  - Build lead capture & lead qualification workflow

- [x] **Phase 3: Deal Pipeline & Kanban Board**
  - Implement deal & pipeline stage schema
  - Build interactive drag-and-drop Kanban deal board
  - Add deal analytics & MRR forecasting summary widgets

### Milestone 2: Financials & Operations
- [x] **Phase 4: Quotes, Invoices & Subscriptions**
  - Build product catalog & inventory tracking
  - Implement quote & invoice generation with payment tracking
  - Recurring subscription management


### Milestone 3: Authentication UI & Route Guards (Current)
- [x] **Phase 6: Auth UI Forms & Middleware Redirect Protection**
  - Custom Sign In page (`/login`) with Email/Phone & Social OAuth
  - Custom Sign Up page (`/register`) with Organization Tenant creation
  - Next.js `middleware.ts` for automatic route guarding & session redirects

### Milestone 4: MVP Polish & Central Dashboard (Current)
- [x] **Phase 7: Central Dashboard & Navigation Integration**
  - Build the `/dashboard` landing page with overview metrics (contacts, revenue, active pipeline)
  - Fix missing navigation links in `dashboard-layout.tsx`
  - Update `middleware.ts` to route authenticated users directly to `/dashboard`
  
- [x] **Phase 8: Billing & CRM UX Enhancements**
  - Add highly visible "Create Quote" and "Create Invoice" modals/buttons
  - Streamline the Customer Database (`/contacts`) for easier data entry

- [x] **Phase 9: Quotation Builder Layout**
  - Advanced Live Document UI for Quotes
  - Dynamic Line Items and Pricing Calculator
  - Signature and T&C integration

- [x] **Phase 10: Invoice Implementation**
  - Implement document-like Invoice Builder UI reusing Quotation pattern
  - Add logic for invoice-specific fields (Payment Terms, Purchase Order, Status)
  - Share the `QuoteData` underlying structure (or abstract it as `DocumentData`)

- [x] **Phase 11: S3 Bucket Integration & File Uploads**
  - Implement real drag-and-drop file/photo uploads in Quotations & Invoices (replacing mocks)
  - Configure backend S3 integration using pre-signed URLs or similar direct upload method
  - Handle file tracking and attachments for documents

- [x] **Phase 12: Auto-Incrementing Document Patterns**
  - Implement intelligent auto-incrementing document patterns in Quotes and Invoices
  - Parse and store patterns per client
  - Display last document metadata in the UI

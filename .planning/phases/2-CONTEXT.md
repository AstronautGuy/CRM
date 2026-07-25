# Phase 2 Context - Customer & Lead Management

## Key Decisions

### 1. Data Models & Entities
- **Company Accounts**: B2B customer records (Name, Domain, Industry, Company Size, Address, Annual Revenue).
- **Individual Contacts**: Personal lead/contact records (First Name, Last Name, Email, Phone, Job Title, linked Company ID).
- **Lead Status & Qualification**: Status tracking (`NEW`, `QUALIFIED`, `CONTACTED`, `NURTURING`, `UNQUALIFIED`).
- **Custom Tags & Labels**: Flexible tag system for segmenting contacts (e.g. `VIP`, `Enterprise`, `Hot Lead`).
- **Activity Notes & History**: Timeline log for notes, calls, emails, and meetings associated with contacts or companies.
- **Employee Assignment History**: Track which team member/sales rep is assigned to a contact/company over time.

### 2. Lead Capture & Data Ingestion
- **Public Lead Form & API Endpoint**: Secure endpoint & embeddable web form for public lead capture into the organization tenant.
- **CSV / Excel Data Ingestion**: Bulk import contacts & companies from CSV files, as well as CSV export capabilities.

### 3. UI Management Views
- **Contacts & Companies Tables**: Filterable, searchable datatables with pagination and tag filters.
- **Contact & Company Detail Views**: Detailed profile page with activity timeline, employee assignment controls, and interaction history logging.

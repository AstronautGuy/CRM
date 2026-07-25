import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `devcrm_${name}`);

// Role & Enums
export const userRoleEnum = pgEnum("devcrm_user_role", ["SUPER_ADMIN", "USER"]);
export const orgRoleEnum = pgEnum("devcrm_org_role", ["OWNER", "ADMIN", "MEMBER", "VIEWER"]);
export const subscriptionStatusEnum = pgEnum("devcrm_subscription_status", ["ACTIVE", "TRIALING", "CANCELED", "PAST_DUE"]);
export const leadStatusEnum = pgEnum("devcrm_lead_status", ["NEW", "QUALIFIED", "CONTACTED", "NURTURING", "UNQUALIFIED"]);

// --- AUTH & USERS TABLES ---
export const users = createTable("user", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull().unique(),
  emailVerified: d.timestamp({ mode: "date", withTimezone: true }),
  image: d.varchar({ length: 255 }),
  phone: d.varchar({ length: 50 }),
  passwordHash: d.text(),
  systemRole: userRoleEnum("system_role").default("USER").notNull(),
  onboardingComplete: d.boolean().default(false).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = createTable("session", (d) => ({
  sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
  userId: d.varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// --- MULTI-TENANCY & ORGANIZATIONS ---
export const organizations = createTable("organization", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  slug: d.varchar({ length: 255 }).notNull().unique(),
  logoUrl: d.text(),
  
  // Advanced Onboarding Fields
  displayName: d.varchar({ length: 255 }),
  teamSize: d.varchar({ length: 50 }),
  website: d.varchar({ length: 255 }),
  phone: d.varchar({ length: 50 }),
  countryCode: d.varchar({ length: 10 }),
  phoneVerified: d.boolean().default(false).notNull(),
  country: d.varchar({ length: 100 }),
  currency: d.varchar({ length: 10 }),
  hasGst: d.boolean().default(false).notNull(),
  gstin: d.varchar({ length: 50 }),
  businessPan: d.varchar({ length: 50 }),
  useCases: d.text(),
  businessType: d.varchar({ length: 100 }),
  addressStreet: d.text(),
  addressCity: d.varchar({ length: 100 }),
  addressState: d.varchar({ length: 100 }),
  addressPincode: d.varchar({ length: 20 }),

  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const organizationMembers = createTable(
  "organization_member",
  (d) => ({
    id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    role: orgRoleEnum("role").default("MEMBER").notNull(),
    createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
  }),
  (t) => [index("org_user_idx").on(t.organizationId, t.userId)]
);

// --- SUBSCRIPTIONS & PLANS ---
export const subscriptionPlans = createTable("subscription_plan", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  code: d.varchar({ length: 100 }).notNull().unique(),
  description: d.text(),
  priceMonthly: d.integer().notNull(),
  priceYearly: d.integer().notNull(),
  maxUsers: d.integer().default(5).notNull(),
  maxContacts: d.integer().default(1000).notNull(),
  isActive: d.boolean().default(true).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const subscriptions = createTable("subscription", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  planId: d.varchar({ length: 255 }).notNull().references(() => subscriptionPlans.id),
  status: subscriptionStatusEnum("status").default("ACTIVE").notNull(),
  currentPeriodStart: d.timestamp({ withTimezone: true }).notNull(),
  currentPeriodEnd: d.timestamp({ withTimezone: true }).notNull(),
  cancelAtPeriodEnd: d.boolean().default(false).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

// --- CRM: COMPANIES & CONTACTS ---
export const companies = createTable("company", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 255 }).notNull(),
  domain: d.varchar({ length: 255 }),
  industry: d.varchar({ length: 100 }),
  employeeCount: d.integer(), // Keeping for backwards compat
  teamSize: d.varchar({ length: 50 }),
  phone: d.varchar({ length: 50 }),
  countryCode: d.varchar({ length: 10 }),
  country: d.varchar({ length: 100 }),
  currency: d.varchar({ length: 10 }),
  hasGst: d.boolean().default(false).notNull(),
  gstin: d.varchar({ length: 50 }),
  businessPan: d.varchar({ length: 50 }),
  businessType: d.varchar({ length: 100 }),
  useCases: d.text(),
  addressStreet: d.text(),
  addressCity: d.varchar({ length: 100 }),
  addressState: d.varchar({ length: 100 }),
  addressPincode: d.varchar({ length: 20 }),
  address: d.text(), // legacy
  assignedUserId: d.varchar({ length: 255 }).references(() => users.id, { onDelete: "set null" }),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const contacts = createTable("contact", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  companyId: d.varchar({ length: 255 }).references(() => companies.id, { onDelete: "set null" }),
  firstName: d.varchar({ length: 100 }).notNull(),
  lastName: d.varchar({ length: 100 }).notNull(),
  email: d.varchar({ length: 255 }).notNull(),
  phone: d.varchar({ length: 50 }),
  jobTitle: d.varchar({ length: 100 }),
  status: leadStatusEnum("status").default("NEW").notNull(),
  assignedUserId: d.varchar({ length: 255 }).references(() => users.id, { onDelete: "set null" }),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const tags = createTable("tag", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 50 }).notNull(),
  color: d.varchar({ length: 20 }).default("#3b82f6").notNull(),
}));

export const contactTags = createTable(
  "contact_tag",
  (d) => ({
    contactId: d.varchar({ length: 255 }).notNull().references(() => contacts.id, { onDelete: "cascade" }),
    tagId: d.varchar({ length: 255 }).notNull().references(() => tags.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.contactId, t.tagId] })]
);

export const activityNotes = createTable("activity_note", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  contactId: d.varchar({ length: 255 }).references(() => contacts.id, { onDelete: "cascade" }),
  companyId: d.varchar({ length: 255 }).references(() => companies.id, { onDelete: "cascade" }),
  authorId: d.varchar({ length: 255 }).notNull().references(() => users.id),
  type: d.varchar({ length: 50 }).default("NOTE").notNull(), // NOTE, CALL, EMAIL, MEETING
  content: d.text().notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const assignmentHistory = createTable("assignment_history", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  contactId: d.varchar({ length: 255 }).references(() => contacts.id, { onDelete: "cascade" }),
  companyId: d.varchar({ length: 255 }).references(() => companies.id, { onDelete: "cascade" }),
  assignedByUserId: d.varchar({ length: 255 }).notNull().references(() => users.id),
  assignedToUserId: d.varchar({ length: 255 }).notNull().references(() => users.id),
  assignedAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

// --- PIPELINES & DEALS ---
export const pipelines = createTable("pipeline", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 255 }).notNull(),
  isDefault: d.boolean().default(false).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const pipelineStages = createTable("pipeline_stage", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  pipelineId: d.varchar({ length: 255 }).notNull().references(() => pipelines.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 255 }).notNull(),
  orderIndex: d.integer().notNull(),
  winProbability: d.integer().default(50).notNull(),
  color: d.varchar({ length: 20 }).default("#3b82f6").notNull(),
}));

export const deals = createTable("deal", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  pipelineId: d.varchar({ length: 255 }).notNull().references(() => pipelines.id, { onDelete: "cascade" }),
  stageId: d.varchar({ length: 255 }).notNull().references(() => pipelineStages.id, { onDelete: "cascade" }),
  title: d.varchar({ length: 255 }).notNull(),
  value: d.integer().default(0).notNull(),
  expectedCloseDate: d.timestamp({ withTimezone: true }),
  contactId: d.varchar({ length: 255 }).references(() => contacts.id, { onDelete: "set null" }),
  companyId: d.varchar({ length: 255 }).references(() => companies.id, { onDelete: "set null" }),
  assignedUserId: d.varchar({ length: 255 }).references(() => users.id, { onDelete: "set null" }),
  orderIndex: d.integer().default(0).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

export const invoiceStatusEnum = pgEnum("devcrm_invoice_status", ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"]);

// --- PRODUCTS & INVENTORY ---
export const products = createTable("product", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 255 }).notNull(),
  sku: d.varchar({ length: 100 }).notNull(),
  description: d.text(),
  unitPrice: d.integer().notNull(), // in cents
  stockQuantity: d.integer().default(0).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

// --- QUOTES & INVOICES ---
export const quotes = createTable("quote", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  companyId: d.varchar({ length: 255 }).references(() => companies.id),
  contactId: d.varchar({ length: 255 }).references(() => contacts.id),
  title: d.varchar({ length: 255 }).notNull(),
  discountPercent: d.integer().default(0).notNull(),
  taxPercent: d.integer().default(0).notNull(),
  totalAmount: d.integer().default(0).notNull(),
  status: d.varchar({ length: 50 }).default("DRAFT").notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const quoteItems = createTable("quote_item", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  quoteId: d.varchar({ length: 255 }).notNull().references(() => quotes.id, { onDelete: "cascade" }),
  productId: d.varchar({ length: 255 }).notNull().references(() => products.id),
  quantity: d.integer().default(1).notNull(),
  unitPrice: d.integer().notNull(),
}));

export const invoices = createTable("invoice", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  quoteId: d.varchar({ length: 255 }).references(() => quotes.id),
  companyId: d.varchar({ length: 255 }).references(() => companies.id),
  contactId: d.varchar({ length: 255 }).references(() => contacts.id),
  invoiceNumber: d.varchar({ length: 100 }).notNull().unique(),
  status: invoiceStatusEnum("status").default("DRAFT").notNull(),
  subtotal: d.integer().notNull(),
  taxAmount: d.integer().notNull(),
  totalAmount: d.integer().notNull(),
  dueDate: d.timestamp({ withTimezone: true }).notNull(),
  paidAt: d.timestamp({ withTimezone: true }),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const taskPriorityEnum = pgEnum("devcrm_task_priority", ["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const taskStatusEnum = pgEnum("devcrm_task_status", ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

// --- MARKETING & AUTOMATION REMINDERS ---
export const adCampaigns = createTable("ad_campaign", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 255 }).notNull(),
  platform: d.varchar({ length: 100 }).notNull(), // GOOGLE_ADS, FACEBOOK_ADS, LINKEDIN_ADS, TWITTER_ADS
  spend: d.integer().default(0).notNull(), // in cents
  clicks: d.integer().default(0).notNull(),
  impressions: d.integer().default(0).notNull(),
  conversions: d.integer().default(0).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const crmTasks = createTable("crm_task", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  contactId: d.varchar({ length: 255 }).references(() => contacts.id, { onDelete: "set null" }),
  dealId: d.varchar({ length: 255 }).references(() => deals.id, { onDelete: "set null" }),
  assignedUserId: d.varchar({ length: 255 }).references(() => users.id, { onDelete: "set null" }),
  title: d.varchar({ length: 255 }).notNull(),
  description: d.text(),
  dueDate: d.timestamp({ withTimezone: true }).notNull(),
  priority: taskPriorityEnum("priority").default("MEDIUM").notNull(),
  status: taskStatusEnum("status").default("PENDING").notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));

export const notifications = createTable("notification", (d) => ({
  id: d.varchar({ length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizationId: d.varchar({ length: 255 }).notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: d.varchar({ length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  title: d.varchar({ length: 255 }).notNull(),
  message: d.text().notNull(),
  isRead: d.boolean().default(false).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
}));




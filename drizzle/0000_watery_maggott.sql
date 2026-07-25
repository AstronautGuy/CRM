CREATE TYPE "public"."devcrm_invoice_status" AS ENUM('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."devcrm_lead_status" AS ENUM('NEW', 'QUALIFIED', 'CONTACTED', 'NURTURING', 'UNQUALIFIED');--> statement-breakpoint
CREATE TYPE "public"."devcrm_org_role" AS ENUM('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');--> statement-breakpoint
CREATE TYPE "public"."devcrm_subscription_status" AS ENUM('ACTIVE', 'TRIALING', 'CANCELED', 'PAST_DUE');--> statement-breakpoint
CREATE TYPE "public"."devcrm_task_priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT');--> statement-breakpoint
CREATE TYPE "public"."devcrm_task_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."devcrm_user_role" AS ENUM('SUPER_ADMIN', 'USER');--> statement-breakpoint
CREATE TABLE "devcrm_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "devcrm_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "devcrm_activity_note" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"contactId" varchar(255),
	"companyId" varchar(255),
	"authorId" varchar(255) NOT NULL,
	"type" varchar(50) DEFAULT 'NOTE' NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_ad_campaign" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"platform" varchar(100) NOT NULL,
	"spend" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"conversions" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_assignment_history" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"contactId" varchar(255),
	"companyId" varchar(255),
	"assignedByUserId" varchar(255) NOT NULL,
	"assignedToUserId" varchar(255) NOT NULL,
	"assignedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_company" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"domain" varchar(255),
	"industry" varchar(100),
	"employeeCount" integer,
	"address" text,
	"assignedUserId" varchar(255),
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "devcrm_contact_tag" (
	"contactId" varchar(255) NOT NULL,
	"tagId" varchar(255) NOT NULL,
	CONSTRAINT "devcrm_contact_tag_contactId_tagId_pk" PRIMARY KEY("contactId","tagId")
);
--> statement-breakpoint
CREATE TABLE "devcrm_contact" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"companyId" varchar(255),
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"jobTitle" varchar(100),
	"status" "devcrm_lead_status" DEFAULT 'NEW' NOT NULL,
	"assignedUserId" varchar(255),
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "devcrm_crm_task" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"contactId" varchar(255),
	"dealId" varchar(255),
	"assignedUserId" varchar(255),
	"title" varchar(255) NOT NULL,
	"description" text,
	"dueDate" timestamp with time zone NOT NULL,
	"priority" "devcrm_task_priority" DEFAULT 'MEDIUM' NOT NULL,
	"status" "devcrm_task_status" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_deal" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"pipelineId" varchar(255) NOT NULL,
	"stageId" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"value" integer DEFAULT 0 NOT NULL,
	"expectedCloseDate" timestamp with time zone,
	"contactId" varchar(255),
	"companyId" varchar(255),
	"assignedUserId" varchar(255),
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "devcrm_invoice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"quoteId" varchar(255),
	"companyId" varchar(255),
	"contactId" varchar(255),
	"invoiceNumber" varchar(100) NOT NULL,
	"status" "devcrm_invoice_status" DEFAULT 'DRAFT' NOT NULL,
	"subtotal" integer NOT NULL,
	"taxAmount" integer NOT NULL,
	"totalAmount" integer NOT NULL,
	"dueDate" timestamp with time zone NOT NULL,
	"paidAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "devcrm_invoice_invoiceNumber_unique" UNIQUE("invoiceNumber")
);
--> statement-breakpoint
CREATE TABLE "devcrm_notification" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_organization_member" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"role" "devcrm_org_role" DEFAULT 'MEMBER' NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_organization" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"logoUrl" text,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "devcrm_organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "devcrm_pipeline_stage" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"pipelineId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"orderIndex" integer NOT NULL,
	"winProbability" integer DEFAULT 50 NOT NULL,
	"color" varchar(20) DEFAULT '#3b82f6' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_pipeline" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_product" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"sku" varchar(100) NOT NULL,
	"description" text,
	"unitPrice" integer NOT NULL,
	"stockQuantity" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_quote_item" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"quoteId" varchar(255) NOT NULL,
	"productId" varchar(255) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unitPrice" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_quote" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"companyId" varchar(255),
	"contactId" varchar(255),
	"title" varchar(255) NOT NULL,
	"discountPercent" integer DEFAULT 0 NOT NULL,
	"taxPercent" integer DEFAULT 0 NOT NULL,
	"totalAmount" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'DRAFT' NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_subscription_plan" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(100) NOT NULL,
	"description" text,
	"priceMonthly" integer NOT NULL,
	"priceYearly" integer NOT NULL,
	"maxUsers" integer DEFAULT 5 NOT NULL,
	"maxContacts" integer DEFAULT 1000 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	CONSTRAINT "devcrm_subscription_plan_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "devcrm_subscription" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"planId" varchar(255) NOT NULL,
	"status" "devcrm_subscription_status" DEFAULT 'ACTIVE' NOT NULL,
	"currentPeriodStart" timestamp with time zone NOT NULL,
	"currentPeriodEnd" timestamp with time zone NOT NULL,
	"cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_tag" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"name" varchar(50) NOT NULL,
	"color" varchar(20) DEFAULT '#3b82f6' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone,
	"image" varchar(255),
	"phone" varchar(50),
	"passwordHash" text,
	"system_role" "devcrm_user_role" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "devcrm_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "devcrm_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "devcrm_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "devcrm_account" ADD CONSTRAINT "devcrm_account_userId_devcrm_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devcrm_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_activity_note" ADD CONSTRAINT "devcrm_activity_note_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_activity_note" ADD CONSTRAINT "devcrm_activity_note_contactId_devcrm_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."devcrm_contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_activity_note" ADD CONSTRAINT "devcrm_activity_note_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_activity_note" ADD CONSTRAINT "devcrm_activity_note_authorId_devcrm_user_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."devcrm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_ad_campaign" ADD CONSTRAINT "devcrm_ad_campaign_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_assignment_history" ADD CONSTRAINT "devcrm_assignment_history_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_assignment_history" ADD CONSTRAINT "devcrm_assignment_history_contactId_devcrm_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."devcrm_contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_assignment_history" ADD CONSTRAINT "devcrm_assignment_history_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_assignment_history" ADD CONSTRAINT "devcrm_assignment_history_assignedByUserId_devcrm_user_id_fk" FOREIGN KEY ("assignedByUserId") REFERENCES "public"."devcrm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_assignment_history" ADD CONSTRAINT "devcrm_assignment_history_assignedToUserId_devcrm_user_id_fk" FOREIGN KEY ("assignedToUserId") REFERENCES "public"."devcrm_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD CONSTRAINT "devcrm_company_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD CONSTRAINT "devcrm_company_assignedUserId_devcrm_user_id_fk" FOREIGN KEY ("assignedUserId") REFERENCES "public"."devcrm_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_contact_tag" ADD CONSTRAINT "devcrm_contact_tag_contactId_devcrm_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."devcrm_contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_contact_tag" ADD CONSTRAINT "devcrm_contact_tag_tagId_devcrm_tag_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."devcrm_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD CONSTRAINT "devcrm_contact_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD CONSTRAINT "devcrm_contact_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD CONSTRAINT "devcrm_contact_assignedUserId_devcrm_user_id_fk" FOREIGN KEY ("assignedUserId") REFERENCES "public"."devcrm_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_crm_task" ADD CONSTRAINT "devcrm_crm_task_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_crm_task" ADD CONSTRAINT "devcrm_crm_task_contactId_devcrm_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."devcrm_contact"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_crm_task" ADD CONSTRAINT "devcrm_crm_task_dealId_devcrm_deal_id_fk" FOREIGN KEY ("dealId") REFERENCES "public"."devcrm_deal"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_crm_task" ADD CONSTRAINT "devcrm_crm_task_assignedUserId_devcrm_user_id_fk" FOREIGN KEY ("assignedUserId") REFERENCES "public"."devcrm_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_deal" ADD CONSTRAINT "devcrm_deal_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_deal" ADD CONSTRAINT "devcrm_deal_pipelineId_devcrm_pipeline_id_fk" FOREIGN KEY ("pipelineId") REFERENCES "public"."devcrm_pipeline"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_deal" ADD CONSTRAINT "devcrm_deal_stageId_devcrm_pipeline_stage_id_fk" FOREIGN KEY ("stageId") REFERENCES "public"."devcrm_pipeline_stage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_deal" ADD CONSTRAINT "devcrm_deal_contactId_devcrm_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."devcrm_contact"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_deal" ADD CONSTRAINT "devcrm_deal_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_deal" ADD CONSTRAINT "devcrm_deal_assignedUserId_devcrm_user_id_fk" FOREIGN KEY ("assignedUserId") REFERENCES "public"."devcrm_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD CONSTRAINT "devcrm_invoice_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD CONSTRAINT "devcrm_invoice_quoteId_devcrm_quote_id_fk" FOREIGN KEY ("quoteId") REFERENCES "public"."devcrm_quote"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD CONSTRAINT "devcrm_invoice_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD CONSTRAINT "devcrm_invoice_contactId_devcrm_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."devcrm_contact"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_notification" ADD CONSTRAINT "devcrm_notification_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_notification" ADD CONSTRAINT "devcrm_notification_userId_devcrm_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devcrm_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_organization_member" ADD CONSTRAINT "devcrm_organization_member_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_organization_member" ADD CONSTRAINT "devcrm_organization_member_userId_devcrm_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devcrm_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_pipeline_stage" ADD CONSTRAINT "devcrm_pipeline_stage_pipelineId_devcrm_pipeline_id_fk" FOREIGN KEY ("pipelineId") REFERENCES "public"."devcrm_pipeline"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_pipeline" ADD CONSTRAINT "devcrm_pipeline_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_product" ADD CONSTRAINT "devcrm_product_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_quote_item" ADD CONSTRAINT "devcrm_quote_item_quoteId_devcrm_quote_id_fk" FOREIGN KEY ("quoteId") REFERENCES "public"."devcrm_quote"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_quote_item" ADD CONSTRAINT "devcrm_quote_item_productId_devcrm_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."devcrm_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD CONSTRAINT "devcrm_quote_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD CONSTRAINT "devcrm_quote_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD CONSTRAINT "devcrm_quote_contactId_devcrm_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."devcrm_contact"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_session" ADD CONSTRAINT "devcrm_session_userId_devcrm_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devcrm_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_subscription" ADD CONSTRAINT "devcrm_subscription_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_subscription" ADD CONSTRAINT "devcrm_subscription_planId_devcrm_subscription_plan_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."devcrm_subscription_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_tag" ADD CONSTRAINT "devcrm_tag_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "org_user_idx" ON "devcrm_organization_member" USING btree ("organizationId","userId");
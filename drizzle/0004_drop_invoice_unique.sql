CREATE TYPE "public"."devcrm_automation_action" AS ENUM('CREATE_NOTIFICATION', 'CREATE_TASK');--> statement-breakpoint
CREATE TYPE "public"."devcrm_automation_trigger" AS ENUM('INVOICE_DUE', 'SUBSCRIPTION_RENEWAL', 'DEAL_STALLED');--> statement-breakpoint
CREATE TYPE "public"."devcrm_client_subscription_cycle" AS ENUM('MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TYPE "public"."devcrm_client_subscription_status" AS ENUM('ACTIVE', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
ALTER TYPE "public"."devcrm_invoice_status" ADD VALUE 'PROFORMA' BEFORE 'SENT';--> statement-breakpoint
CREATE TABLE "devcrm_automation_rule" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"trigger_type" "devcrm_automation_trigger" NOT NULL,
	"daysOffset" integer DEFAULT 0 NOT NULL,
	"action_type" "devcrm_automation_action" NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "devcrm_client_subscription" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"companyId" varchar(255) NOT NULL,
	"productId" varchar(255) NOT NULL,
	"status" "devcrm_client_subscription_status" DEFAULT 'ACTIVE' NOT NULL,
	"billing_cycle" "devcrm_client_subscription_cycle" DEFAULT 'MONTHLY' NOT NULL,
	"price" integer NOT NULL,
	"startDate" timestamp with time zone NOT NULL,
	"nextRenewalDate" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "devcrm_payment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"invoiceId" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"paymentDate" timestamp with time zone NOT NULL,
	"paymentMethod" varchar(50) NOT NULL,
	"referenceNumber" varchar(255),
	"notes" text,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_statement" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"companyId" varchar(255) NOT NULL,
	"statementNumber" varchar(100) NOT NULL,
	"startDate" timestamp with time zone NOT NULL,
	"endDate" timestamp with time zone NOT NULL,
	"openingBalance" integer NOT NULL,
	"closingBalance" integer NOT NULL,
	"transactions" jsonb NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devcrm_invoice" DROP CONSTRAINT "devcrm_invoice_invoiceNumber_unique";--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "amountPaid" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "balanceDue" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_automation_rule" ADD CONSTRAINT "devcrm_automation_rule_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_client_subscription" ADD CONSTRAINT "devcrm_client_subscription_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_client_subscription" ADD CONSTRAINT "devcrm_client_subscription_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_client_subscription" ADD CONSTRAINT "devcrm_client_subscription_productId_devcrm_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."devcrm_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_payment" ADD CONSTRAINT "devcrm_payment_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_payment" ADD CONSTRAINT "devcrm_payment_invoiceId_devcrm_invoice_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."devcrm_invoice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_statement" ADD CONSTRAINT "devcrm_statement_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_statement" ADD CONSTRAINT "devcrm_statement_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE cascade ON UPDATE no action;
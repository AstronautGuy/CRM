CREATE TYPE "public"."devcrm_product_type" AS ENUM('PRODUCT', 'SERVICE');--> statement-breakpoint
CREATE TABLE "devcrm_user_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"defaultCurrency" varchar(10) DEFAULT 'INR' NOT NULL,
	"customCurrencySymbol" varchar(10),
	"numberFormat" varchar(50) DEFAULT 'en-IN' NOT NULL,
	"decimalDigits" integer DEFAULT 2 NOT NULL,
	"roundQuantity" boolean DEFAULT false NOT NULL,
	"roundRate" boolean DEFAULT false NOT NULL,
	"customLabels" jsonb,
	"signatureImage" text,
	"tncList" jsonb,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "devcrm_contact_tag" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "devcrm_quote_item" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "devcrm_contact_tag" CASCADE;--> statement-breakpoint
DROP TABLE "devcrm_quote_item" CASCADE;--> statement-breakpoint
ALTER TABLE "devcrm_activity_note" DROP CONSTRAINT "devcrm_activity_note_contactId_devcrm_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "devcrm_assignment_history" DROP CONSTRAINT "devcrm_assignment_history_contactId_devcrm_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "devcrm_contact" DROP CONSTRAINT "devcrm_contact_assignedUserId_devcrm_user_id_fk";
--> statement-breakpoint
ALTER TABLE "devcrm_crm_task" DROP CONSTRAINT "devcrm_crm_task_contactId_devcrm_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "devcrm_deal" DROP CONSTRAINT "devcrm_deal_contactId_devcrm_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "devcrm_invoice" DROP CONSTRAINT "devcrm_invoice_contactId_devcrm_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "devcrm_quote" DROP CONSTRAINT "devcrm_quote_contactId_devcrm_contact_id_fk";
--> statement-breakpoint
ALTER TABLE "devcrm_contact" ALTER COLUMN "lastName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_product" ALTER COLUMN "sku" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "logoUrl" text;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "addressCountry" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "uid" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "avatarUrl" text;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "salutation" varchar(20);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "additionalEmails" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "additionalPhones" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "pan" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "aadhaar" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "passport" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "socialLinks" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "addressCountry" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "addressState" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "addressDistrict" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "addressCity" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "addressBuilding" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "addressStreet" text;--> statement-breakpoint
ALTER TABLE "devcrm_contact" ADD COLUMN "addressZip" varchar(20);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "addressCountry" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_product" ADD COLUMN "type" "devcrm_product_type" DEFAULT 'PRODUCT' NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_product" ADD COLUMN "unit" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "quoteNumber" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "dueDate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "labels" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "customFields" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "showTotalInPdf" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "showTotalInWords" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "lineItems" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "discountType" varchar(20) DEFAULT 'AMOUNT' NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "discountValue" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "additionalCharges" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "signatureType" varchar(50) DEFAULT 'IMAGE' NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "signatureName" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "signatureData" text;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "attachments" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "terms" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "contactEmail" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_quote" ADD COLUMN "contactPhone" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_user_settings" ADD CONSTRAINT "devcrm_user_settings_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_user_settings" ADD CONSTRAINT "devcrm_user_settings_userId_devcrm_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devcrm_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_activity_note" DROP COLUMN "contactId";--> statement-breakpoint
ALTER TABLE "devcrm_assignment_history" DROP COLUMN "contactId";--> statement-breakpoint
ALTER TABLE "devcrm_contact" DROP COLUMN "jobTitle";--> statement-breakpoint
ALTER TABLE "devcrm_contact" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "devcrm_contact" DROP COLUMN "assignedUserId";--> statement-breakpoint
ALTER TABLE "devcrm_crm_task" DROP COLUMN "contactId";--> statement-breakpoint
ALTER TABLE "devcrm_deal" DROP COLUMN "contactId";--> statement-breakpoint
ALTER TABLE "devcrm_invoice" DROP COLUMN "contactId";--> statement-breakpoint
ALTER TABLE "devcrm_quote" DROP COLUMN "contactId";--> statement-breakpoint
ALTER TABLE "devcrm_quote" DROP COLUMN "discountPercent";
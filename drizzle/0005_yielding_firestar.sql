CREATE TABLE "devcrm_api_key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"keyHash" text NOT NULL,
	"expiresAt" timestamp with time zone,
	"revokedAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "title" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "labels" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "customFields" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "showTotalInPdf" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "showTotalInWords" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "lineItems" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "taxPercent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "discountType" varchar(20) DEFAULT 'AMOUNT' NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "discountValue" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "additionalCharges" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "signatureType" varchar(50) DEFAULT 'IMAGE' NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "signatureName" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "signatureData" text;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "attachments" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "terms" jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "contactEmail" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_invoice" ADD COLUMN "contactPhone" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_api_key" ADD CONSTRAINT "devcrm_api_key_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_api_key" ADD CONSTRAINT "devcrm_api_key_userId_devcrm_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."devcrm_user"("id") ON DELETE cascade ON UPDATE no action;
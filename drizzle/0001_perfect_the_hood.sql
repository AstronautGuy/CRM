ALTER TABLE "devcrm_company" ADD COLUMN "teamSize" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "countryCode" varchar(10);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "country" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "currency" varchar(10);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "hasGst" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "gstin" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "businessPan" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "businessType" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "useCases" text;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "addressStreet" text;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "addressCity" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "addressState" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "addressPincode" varchar(20);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "clientType" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "taxTreatment" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "extraIds" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "shippingDetails" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "alias" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "uid" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "showEmailInInvoice" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "showPhoneInInvoice" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "paymentDueDays" integer;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "customFields" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_company" ADD COLUMN "attachments" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "displayName" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "teamSize" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "countryCode" varchar(10);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "phoneVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "country" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "currency" varchar(10);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "hasGst" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "gstin" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "businessPan" varchar(50);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "useCases" text;--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "businessType" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "addressStreet" text;--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "addressCity" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "addressState" varchar(100);--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "addressPincode" varchar(20);--> statement-breakpoint
ALTER TABLE "devcrm_user" ADD COLUMN "onboardingComplete" boolean DEFAULT false NOT NULL;
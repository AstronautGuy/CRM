ALTER TYPE "public"."devcrm_automation_action" ADD VALUE 'SEND_EMAIL';--> statement-breakpoint
ALTER TYPE "public"."devcrm_automation_action" ADD VALUE 'INTERNAL_ALERT';--> statement-breakpoint
ALTER TYPE "public"."devcrm_automation_trigger" ADD VALUE 'QUOTE_SENT';--> statement-breakpoint
CREATE TABLE "devcrm_automation_log" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"ruleId" varchar(255) NOT NULL,
	"targetEntityId" varchar(255) NOT NULL,
	"executedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devcrm_communication" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"companyId" varchar(255),
	"targetEntityId" varchar(255),
	"type" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"sentAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devcrm_automation_rule" ADD COLUMN "actionPayload" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "devcrm_notification" ADD COLUMN "link" varchar(255);--> statement-breakpoint
ALTER TABLE "devcrm_automation_log" ADD CONSTRAINT "devcrm_automation_log_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_automation_log" ADD CONSTRAINT "devcrm_automation_log_ruleId_devcrm_automation_rule_id_fk" FOREIGN KEY ("ruleId") REFERENCES "public"."devcrm_automation_rule"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_communication" ADD CONSTRAINT "devcrm_communication_organizationId_devcrm_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."devcrm_organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devcrm_communication" ADD CONSTRAINT "devcrm_communication_companyId_devcrm_company_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."devcrm_company"("id") ON DELETE cascade ON UPDATE no action;
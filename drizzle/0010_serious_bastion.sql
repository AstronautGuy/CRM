CREATE TABLE "devcrm_global_settings" (
	"id" varchar(255) PRIMARY KEY DEFAULT 'default' NOT NULL,
	"maintenanceMode" boolean DEFAULT false NOT NULL,
	"enableBetaFeatures" boolean DEFAULT false NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "devcrm_organization" ADD COLUMN "isActive" boolean DEFAULT true NOT NULL;
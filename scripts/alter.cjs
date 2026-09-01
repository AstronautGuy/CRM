require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
async function run() {
  try {
    await sql`ALTER TYPE "public"."devcrm_invoice_status" ADD VALUE IF NOT EXISTS 'PROFORMA' BEFORE 'SENT'`;
  } catch (e) {
    console.log(e.message);
  }
  try {
    await sql`ALTER TABLE "devcrm_invoice" DROP CONSTRAINT IF EXISTS "devcrm_invoice_invoiceNumber_unique"`;
    await sql`ALTER TABLE "devcrm_invoice" ADD COLUMN IF NOT EXISTS "version" integer DEFAULT 1 NOT NULL`;
    await sql`ALTER TABLE "devcrm_invoice" ADD COLUMN IF NOT EXISTS "amountPaid" integer DEFAULT 0 NOT NULL`;
    await sql`ALTER TABLE "devcrm_invoice" ADD COLUMN IF NOT EXISTS "balanceDue" integer DEFAULT 0 NOT NULL`;
    await sql`ALTER TABLE "devcrm_quote" ADD COLUMN IF NOT EXISTS "version" integer DEFAULT 1 NOT NULL`;
    console.log('done');
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();

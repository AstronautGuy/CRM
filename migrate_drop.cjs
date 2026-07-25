const postgres = require('postgres');
const sql = postgres('postgresql://neondb_owner:npg_Dvx5KZBSXT0d@ep-bitter-darkness-azznf1fc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function run() {
  try {
    await sql.unsafe('DROP TABLE IF EXISTS "devcrm_contact_tag" CASCADE');
    await sql.unsafe('DROP TABLE IF EXISTS "devcrm_contact" CASCADE');
    
    // Also drop the foreign keys pointing to contact in other tables if they exist
    // Actually, CASCADE drops dependent objects. Let's just drop the columns that referenced it.
    await sql.unsafe('ALTER TABLE "devcrm_activity_note" DROP COLUMN IF EXISTS "contactId"');
    await sql.unsafe('ALTER TABLE "devcrm_assignment_history" DROP COLUMN IF EXISTS "contactId"');
    await sql.unsafe('ALTER TABLE "devcrm_deal" DROP COLUMN IF EXISTS "contactId"');
    await sql.unsafe('ALTER TABLE "devcrm_quote" DROP COLUMN IF EXISTS "contactId"');
    await sql.unsafe('ALTER TABLE "devcrm_invoice" DROP COLUMN IF EXISTS "contactId"');
    await sql.unsafe('ALTER TABLE "devcrm_crm_task" DROP COLUMN IF EXISTS "contactId"');

    console.log('Done dropping contact references');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();

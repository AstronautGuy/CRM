const postgres = require('postgres');
const sql = postgres('postgresql://neondb_owner:npg_Dvx5KZBSXT0d@ep-bitter-darkness-azznf1fc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function run() {
  try {
    await sql.unsafe('ALTER TABLE "devcrm_company" ADD COLUMN "addressCountry" varchar(100)');
    console.log('Done addressCountry');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();

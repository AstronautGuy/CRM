require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

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

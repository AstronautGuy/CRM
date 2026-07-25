import postgres from 'postgres';
import fs from 'fs';

const envStr = fs.readFileSync('.env', 'utf-8');
const dbUrlMatch = envStr.match(/DATABASE_URL="([^"]+)"/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : '';

async function run() {
  const sql = postgres(dbUrl);

  try {
    await sql`DROP TABLE IF EXISTS devcrm_quote_item CASCADE`;
    await sql`DROP TABLE IF EXISTS devcrm_invoice CASCADE`;
    await sql`DROP TABLE IF EXISTS devcrm_quote CASCADE`;
    console.log('Tables dropped successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();

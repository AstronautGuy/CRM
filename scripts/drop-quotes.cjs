const pg = require('pg');
require('dotenv').config();

async function run() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await pool.query('DROP TABLE IF EXISTS devcrm_quote_item CASCADE;');
    await pool.query('DROP TABLE IF EXISTS devcrm_invoice CASCADE;');
    await pool.query('DROP TABLE IF EXISTS devcrm_quote CASCADE;');
    console.log('Tables dropped successfully.');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();

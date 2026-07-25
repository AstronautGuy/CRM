import postgres from 'postgres';
import fs from 'fs';

const envStr = fs.readFileSync('.env', 'utf-8');
const dbUrlMatch = envStr.match(/DATABASE_URL="([^"]+)"/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : '';

async function run() {
  const sql = postgres(dbUrl);
  
  const sqlContent = fs.readFileSync('drizzle/0002_misty_mindworm.sql', 'utf-8');
  const statements = sqlContent.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s.length > 0);
  
  console.log(`Executing ${statements.length} statements...`);
  
  for (const statement of statements) {
    try {
      await sql.unsafe(statement);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`Skipping: already exists - ${statement.slice(0, 50)}...`);
      } else if (err.message.includes('does not exist')) {
        console.log(`Skipping: does not exist - ${statement.slice(0, 50)}...`);
      } else {
        console.error(`Error executing: ${statement.slice(0, 50)}...`, err.message);
      }
    }
  }
  
  console.log('Migration applied manually.');
  await sql.end();
}

run();

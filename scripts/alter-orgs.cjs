import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  try {
    await sql`ALTER TABLE "devcrm_organizations" ADD COLUMN "svixAppId" varchar(255);`;
    console.log("Column svixAppId added successfully!");
  } catch (err: any) {
    console.error("Error adding column:", err.message);
  } finally {
    await sql.end();
  }
}

main();

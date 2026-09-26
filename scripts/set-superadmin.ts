import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  await db.update(users).set({ systemRole: "SUPER_ADMIN" });
  console.log("Updated all users to SUPER_ADMIN");
  process.exit(0);
}

main();

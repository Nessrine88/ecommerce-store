import "dotenv/config";

import { db } from "./index";
import { products, users } from "./schema";
import sampleData from "./sample-data";

async function main() {
  await db.delete(products);
  await db.delete(users);
  await db.insert(users).values(sampleData.users);
  await db.insert(products).values(sampleData.products);
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Seed failed:");
  console.error(error);
  process.exit(1);
});

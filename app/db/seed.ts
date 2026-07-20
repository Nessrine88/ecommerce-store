import "dotenv/config";

import { db } from "./index";
import { products, users } from "./schema";
import sampleData from "./sample-data";


async function main() {
  console.log("🌱 Seeding database...");

  await db.delete(products);
  await db.delete(users);

  console.log("🗑️ Old data deleted");

  await db.insert(users).values(
    sampleData.users
  );

  console.log("👤 Users inserted");

  await db.insert(products).values(
    sampleData.products
  );

  console.log("🌿 Products inserted");

  console.log("✅ Database seeded successfully");

  process.exit(0);
}


main().catch((error) => {
  console.error("❌ Seed failed:");
  console.error(error);
  process.exit(1);
});
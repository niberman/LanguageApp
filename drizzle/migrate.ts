import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

const runMigration = async () => {
  const connection = postgres(connectionString, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  await migrate(db, { migrationsFolder: "migrations" });

  console.log("✅ Migrations completed!");

  await connection.end();
  process.exit(0);
};

runMigration().catch((err) => {
  console.error("❌ Migration failed!");
  console.error(err);
  process.exit(1);
});

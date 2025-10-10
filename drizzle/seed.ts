import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

const connectionString = process.env.DATABASE_URL!;

const ENGLISH_LEVELS = Array.from({ length: 17 }, (_, i) => ({
  track: "english",
  number: i + 1,
  title: `English Foundations ${i + 1}`,
  quizletSetIds: [`english-foundations-${i + 1}`],
  youtubePlaylistIds: [`english-playlist-${i + 1}`],
}));

const SPANISH_LEVELS = Array.from({ length: 12 }, (_, i) => ({
  track: "spanish",
  number: i + 1,
  title: `Fundamentos de Español ${i + 1}`,
  quizletSetIds: [`spanish-fundamentos-${i + 1}`],
  youtubePlaylistIds: [`spanish-playlist-${i + 1}`],
}));

const seed = async () => {
  const connection = postgres(connectionString, { max: 1 });
  const db = drizzle(connection, { schema });

  console.log("⏳ Seeding database...");

  try {
    // Check if levels already exist
    const existingLevels = await db.select().from(schema.levels).limit(1);
    
    if (existingLevels.length > 0) {
      console.log("ℹ️  Levels already exist, skipping seed...");
    } else {
      // Insert all levels
      const allLevels = [...ENGLISH_LEVELS, ...SPANISH_LEVELS];
      await db.insert(schema.levels).values(allLevels);
      console.log(`✅ Seeded ${allLevels.length} levels!`);
    }

    console.log("✅ Seeding completed!");
  } catch (error) {
    console.error("❌ Seeding failed!");
    console.error(error);
    throw error;
  } finally {
    await connection.end();
    process.exit(0);
  }
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

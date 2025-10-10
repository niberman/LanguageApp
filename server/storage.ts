import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  Profile,
  InsertProfile,
  Level,
  InsertLevel,
  ProgressEvent,
  InsertProgressEvent,
  InsertWaitlistEmail,
} from "@shared/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export interface IStorage {
  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile & { id: string }): Promise<Profile>;
  updateProfile(userId: string, data: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Level operations
  getAllLevels(): Promise<Level[]>;
  getLevelsByTrack(track: string): Promise<Level[]>;
  getLevel(track: string, number: number): Promise<Level | undefined>;
  createLevel(level: InsertLevel): Promise<Level>;
  updateLevel(id: string, data: Partial<InsertLevel>): Promise<Level | undefined>;
  deleteLevel(id: string): Promise<void>;

  // Progress operations
  getUserProgress(userId: string): Promise<ProgressEvent[]>;
  getUserProgressByTrack(userId: string, track: string): Promise<ProgressEvent[]>;
  createProgressEvent(event: InsertProgressEvent): Promise<ProgressEvent>;
  getUserStreak(userId: string): Promise<number>;
  getUserLevelProgress(userId: string, track: string, levelNumber: number): Promise<{ quizletViewed: boolean; videoWatched: boolean }>;

  // Waitlist operations
  addToWaitlist(email: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // Profile operations
  async getProfile(userId: string): Promise<Profile | undefined> {
    const result = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.id, userId))
      .limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile & { id: string }): Promise<Profile> {
    const result = await db
      .insert(schema.profiles)
      .values(profile)
      .returning();
    return result[0];
  }

  async updateProfile(userId: string, data: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db
      .update(schema.profiles)
      .set(data)
      .where(eq(schema.profiles.id, userId))
      .returning();
    return result[0];
  }

  // Level operations
  async getAllLevels(): Promise<Level[]> {
    return db.select().from(schema.levels).orderBy(schema.levels.track, schema.levels.number);
  }

  async getLevelsByTrack(track: string): Promise<Level[]> {
    return db
      .select()
      .from(schema.levels)
      .where(eq(schema.levels.track, track))
      .orderBy(schema.levels.number);
  }

  async getLevel(track: string, number: number): Promise<Level | undefined> {
    const result = await db
      .select()
      .from(schema.levels)
      .where(and(eq(schema.levels.track, track), eq(schema.levels.number, number)))
      .limit(1);
    return result[0];
  }

  async createLevel(level: InsertLevel): Promise<Level> {
    const result = await db.insert(schema.levels).values(level).returning();
    return result[0];
  }

  async updateLevel(id: string, data: Partial<InsertLevel>): Promise<Level | undefined> {
    const result = await db
      .update(schema.levels)
      .set(data)
      .where(eq(schema.levels.id, id))
      .returning();
    return result[0];
  }

  async deleteLevel(id: string): Promise<void> {
    await db.delete(schema.levels).where(eq(schema.levels.id, id));
  }

  // Progress operations
  async getUserProgress(userId: string): Promise<ProgressEvent[]> {
    return db
      .select()
      .from(schema.progressEvents)
      .where(eq(schema.progressEvents.userId, userId))
      .orderBy(desc(schema.progressEvents.createdAt));
  }

  async getUserProgressByTrack(userId: string, track: string): Promise<ProgressEvent[]> {
    return db
      .select()
      .from(schema.progressEvents)
      .where(and(eq(schema.progressEvents.userId, userId), eq(schema.progressEvents.track, track)))
      .orderBy(desc(schema.progressEvents.createdAt));
  }

  async createProgressEvent(event: InsertProgressEvent): Promise<ProgressEvent> {
    const result = await db.insert(schema.progressEvents).values(event).returning();
    return result[0];
  }

  async getUserStreak(userId: string): Promise<number> {
    // Get distinct days with activity, ordered by date descending
    const events = await db
      .selectDistinct({
        date: sql<string>`DATE(${schema.progressEvents.createdAt})`,
      })
      .from(schema.progressEvents)
      .where(eq(schema.progressEvents.userId, userId))
      .orderBy(desc(sql`DATE(${schema.progressEvents.createdAt})`));

    if (events.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < events.length; i++) {
      const eventDate = new Date(events[i].date);
      eventDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (eventDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async getUserLevelProgress(
    userId: string,
    track: string,
    levelNumber: number
  ): Promise<{ quizletViewed: boolean; videoWatched: boolean }> {
    const events = await db
      .select()
      .from(schema.progressEvents)
      .where(
        and(
          eq(schema.progressEvents.userId, userId),
          eq(schema.progressEvents.track, track),
          eq(schema.progressEvents.levelNumber, levelNumber)
        )
      );

    return {
      quizletViewed: events.some((e) => e.kind === "quizlet_view"),
      videoWatched: events.some((e) => e.kind === "video_watch"),
    };
  }

  // Waitlist operations
  async addToWaitlist(email: string): Promise<void> {
    await db
      .insert(schema.waitlistEmails)
      .values({ email })
      .onConflictDoNothing();
  }
}

export const storage = new DbStorage();

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, uuid, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles table - extends Supabase auth.users
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  locale: text("locale").default("en").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table for authentication
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Levels table
export const levels = pgTable("levels", {
  id: uuid("id").primaryKey().defaultRandom(),
  track: text("track").notNull(), // "english" | "spanish"
  number: integer("number").notNull(),
  title: text("title").notNull(),
  quizletSetIds: text("quizlet_set_ids").array().notNull().default(sql`ARRAY[]::text[]`),
  youtubePlaylistIds: text("youtube_playlist_ids").array().notNull().default(sql`ARRAY[]::text[]`),
}, (table) => ({
  uniqueTrackNumber: unique().on(table.track, table.number),
}));

// Progress events table
export const progressEvents = pgTable("progress_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  track: text("track").notNull(),
  levelNumber: integer("level_number").notNull(),
  kind: text("kind").notNull(), // "quizlet_view" | "video_watch"
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Waitlist emails table
export const waitlistEmails = pgTable("waitlist_emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertLevelSchema = createInsertSchema(levels).omit({
  id: true,
});

export const insertProgressEventSchema = createInsertSchema(progressEvents).omit({
  id: true,
  createdAt: true,
});

export const insertWaitlistEmailSchema = createInsertSchema(waitlistEmails).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLevel = z.infer<typeof insertLevelSchema>;
export type Level = typeof levels.$inferSelect;

export type InsertProgressEvent = z.infer<typeof insertProgressEventSchema>;
export type ProgressEvent = typeof progressEvents.$inferSelect;

export type InsertWaitlistEmail = z.infer<typeof insertWaitlistEmailSchema>;
export type WaitlistEmail = typeof waitlistEmails.$inferSelect;

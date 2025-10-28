import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  Profile,
  InsertProfile,
  Course,
  Lesson,
  Topic,
  Activity,
  ActivityCompletion,
  InsertWaitlistEmail,
} from "@shared/schema";
import {
  Course as CourseModel,
  Lesson as LessonModel,
  Topic as TopicModel,
  VideoActivity,
  QuizletActivity,
  AIChatActivity,
} from "@shared/models";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export interface IStorage {
  // Profile operations
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile & { id: string }): Promise<Profile>;
  updateProfile(userId: string, data: Partial<InsertProfile>): Promise<Profile | undefined>;

  // Course operations (NEW OOP MODEL)
  getAllCourses(): Promise<Course[]>;
  getCourseWithContent(courseId: string): Promise<CourseModel | null>;

  // Activity completion operations
  completeActivity(userId: string, activityId: string): Promise<ActivityCompletion>;
  getUserCompletions(userId: string): Promise<ActivityCompletion[]>;
  getUserStreak(userId: string): Promise<number>;

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

  // Course operations (NEW OOP MODEL)
  async getAllCourses(): Promise<Course[]> {
    return db.select().from(schema.courses);
  }

  async getCourseWithContent(courseId: string): Promise<CourseModel | null> {
    // Get course
    const courseResults = await db
      .select()
      .from(schema.courses)
      .where(eq(schema.courses.id, courseId))
      .limit(1);

    if (courseResults.length === 0) return null;
    const course = courseResults[0];

    // Get lessons for this course
    const lessonResults = await db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.courseId, courseId))
      .orderBy(schema.lessons.order);

    const courseModel = new CourseModel(course.id, course.title, course.description);

    // For each lesson, get topics and activities
    for (const lesson of lessonResults) {
      const lessonModel = new LessonModel(lesson.id, lesson.title, lesson.order);

      // Get topics for this lesson
      const topicResults = await db
        .select()
        .from(schema.topics)
        .where(eq(schema.topics.lessonId, lesson.id));

      for (const topic of topicResults) {
        const topicModel = new TopicModel(topic.id, topic.title, topic.summary);

        // Get activities for this topic, ordered by type (videos first, then quizlet, then aiChat)
        const activityResults = await db
          .select()
          .from(schema.activities)
          .where(eq(schema.activities.topicId, topic.id))
          .orderBy(
            sql`CASE 
              WHEN ${schema.activities.type} = 'video' THEN 1
              WHEN ${schema.activities.type} = 'quizlet' THEN 2
              WHEN ${schema.activities.type} = 'aiChat' THEN 3
              ELSE 4
            END`
          );

        // Debug: Log the order of activities
        console.log(`Topic ${topic.id} activities:`, activityResults.map(a => ({ type: a.type, id: a.id.substring(0, 8) })));
        
        for (const activity of activityResults) {
          let activityModel;
          const data = activity.data as any;

          switch (activity.type) {
            case 'video':
              activityModel = new VideoActivity(activity.id, data.videoUrl);
              break;
            case 'quizlet':
              activityModel = new QuizletActivity(activity.id, data.embedUrl);
              break;
            case 'aiChat':
              activityModel = new AIChatActivity(activity.id, data.promptSet);
              break;
            default:
              continue;
          }

          topicModel.addActivity(activityModel);
        }

        lessonModel.addTopic(topicModel);
      }

      courseModel.addLesson(lessonModel);
    }

    return courseModel;
  }

  // Activity completion operations
  async completeActivity(userId: string, activityId: string): Promise<ActivityCompletion> {
    // Check if already completed
    const existing = await db
      .select()
      .from(schema.activityCompletions)
      .where(
        and(
          eq(schema.activityCompletions.userId, userId),
          eq(schema.activityCompletions.activityId, activityId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const result = await db
      .insert(schema.activityCompletions)
      .values({ userId, activityId })
      .returning();
    return result[0];
  }

  async getUserCompletions(userId: string): Promise<ActivityCompletion[]> {
    return db
      .select()
      .from(schema.activityCompletions)
      .where(eq(schema.activityCompletions.userId, userId))
      .orderBy(desc(schema.activityCompletions.completedAt));
  }

  async getUserStreak(userId: string): Promise<number> {
    // Get distinct days with activity, ordered by date descending
    const completions = await db
      .selectDistinct({
        date: sql<string>`DATE(${schema.activityCompletions.completedAt})`,
      })
      .from(schema.activityCompletions)
      .where(eq(schema.activityCompletions.userId, userId))
      .orderBy(desc(sql`DATE(${schema.activityCompletions.completedAt})`));

    if (completions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < completions.length; i++) {
      const completionDate = new Date(completions[i].date);
      completionDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (completionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
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

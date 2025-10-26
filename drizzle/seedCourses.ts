import { db } from "../server/storage";
import * as schema from "../shared/schema";

async function seedCourses() {
  console.log("🌱 Seeding courses data...");

  try {
    // Create course
    const [course1] = await db
      .insert(schema.courses)
      .values({
        title: "Fundamentos de Inglés 1",
        description: "Introductory English course covering basics of greetings, introductions, and essential vocabulary",
      })
      .returning();

    console.log(`✅ Created course: ${course1.title}`);

    // Create lessons for course 1
    const [lesson1] = await db
      .insert(schema.lessons)
      .values({
        courseId: course1.id,
        title: "Lección 1: Greetings and Introductions",
        order: 1,
      })
      .returning();

    const [lesson2] = await db
      .insert(schema.lessons)
      .values({
        courseId: course1.id,
        title: "Lección 2: Numbers and Counting",
        order: 2,
      })
      .returning();

    console.log(`✅ Created ${2} lessons`);

    // Create topics for lesson 1
    const [topic1] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Basic Greetings",
        summary: "Learn essential greetings in English like Hello, Hi, Good morning, etc.",
      })
      .returning();

    const [topic2] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Introducing Yourself",
        summary: "Master the phrases needed to introduce yourself: My name is..., I'm from..., etc.",
      })
      .returning();

    // Create topics for lesson 2
    const [topic3] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson2.id,
        title: "Numbers 1-20",
        summary: "Learn to count from 1 to 20 in English",
      })
      .returning();

    console.log(`✅ Created ${3} topics`);

    // Create activities for topic 1 (Basic Greetings)
    await db.insert(schema.activities).values([
      {
        topicId: topic1.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=g9BERd6yRLI&t=1483s",
        },
      },
      {
        topicId: topic1.id,
        type: "quizlet",
        data: {
          quizletId: "123456789",
        },
      },
      {
        topicId: topic1.id,
        type: "aiChat",
        data: {
          promptSet: [
            "Hello! How are you?",
            "Good morning! What's your name?",
            "Nice to meet you!",
          ],
        },
      },
    ]);

    // Create activities for topic 2 (Introducing Yourself)
    await db.insert(schema.activities).values([
      {
        topicId: topic2.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=example2",
        },
      },
      {
        topicId: topic2.id,
        type: "quizlet",
        data: {
          quizletId: "987654321",
        },
      },
    ]);

    // Create activities for topic 3 (Numbers 1-20)
    await db.insert(schema.activities).values([
      {
        topicId: topic3.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=example3",
        },
      },
      {
        topicId: topic3.id,
        type: "quizlet",
        data: {
          quizletId: "555555555",
        },
      },
    ]);

    console.log(`✅ Created ${8} activities`);
    console.log("✨ Seed data created successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

seedCourses()
  .then(() => {
    console.log("🎉 Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });

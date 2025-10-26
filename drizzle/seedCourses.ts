import { db } from "../server/storage";
import * as schema from "../shared/schema";

async function seedCourses() {
  console.log("🌱 Sembrando datos de cursos...");

  try {
    // Crear curso
    const [course1] = await db
      .insert(schema.courses)
      .values({
        title: "Fundamentos de Inglés 1",
        description: "Curso introductorio de inglés que cubre los conceptos básicos de saludos, presentaciones y vocabulario esencial",
      })
      .returning();

    console.log(`✅ Curso creado: ${course1.title}`);

    // Crear lecciones para el curso 1
    const [lesson1] = await db
      .insert(schema.lessons)
      .values({
        courseId: course1.id,
        title: "Lección 1: Saludos y Presentaciones",
        order: 1,
      })
      .returning();

    const [lesson2] = await db
      .insert(schema.lessons)
      .values({
        courseId: course1.id,
        title: "Lección 2: Números y Conteo",
        order: 2,
      })
      .returning();

    console.log(`✅ ${2} lecciones creadas`);

    // Crear temas para la lección 1
    const [topic1] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Saludos Básicos",
        summary: "Aprende saludos esenciales en inglés como Hello, Hi, Good morning, etc.",
      })
      .returning();

    const [topic2] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Presentándote a Ti Mismo",
        summary: "Domina las frases necesarias para presentarte: My name is..., I'm from..., etc.",
      })
      .returning();

    // Crear temas para la lección 2
    const [topic3] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson2.id,
        title: "Números del 1 al 20",
        summary: "Aprende a contar del 1 al 20 en inglés",
      })
      .returning();

    console.log(`✅ ${3} temas creados`);

    // Crear actividades para el tema 1 (Saludos Básicos)
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
            "¡Hola! ¿Cómo estás?",
            "¡Buenos días! ¿Cuál es tu nombre?",
            "¡Mucho gusto!",
          ],
        },
      },
    ]);

    // Crear actividades para el tema 2 (Presentándote)
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

    // Crear actividades para el tema 3 (Números 1-20)
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

    console.log(`✅ ${8} actividades creadas`);
    console.log("✨ Datos sembrados exitosamente!");
  } catch (error) {
    console.error("❌ Error al sembrar datos:", error);
    throw error;
  }
}

seedCourses()
  .then(() => {
    console.log("🎉 ¡Siembra completada!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Siembra fallida:", error);
    process.exit(1);
  });

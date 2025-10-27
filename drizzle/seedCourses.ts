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
        description:
          "Curso introductorio de inglés que cubre los conceptos básicos de saludos, presentaciones y vocabulario esencial",
      })
      .returning();

    console.log(`✅ Curso creado: ${course1.title}`);

    // ========================================
    // LECCIÓN 1 - SIN NOMBRE (solo "Lección 1")
    // ========================================
    const [lesson1] = await db
      .insert(schema.lessons)
      .values({
        courseId: course1.id,
        title: "Lección 1", // ⬅️ CAMBIADO: Sin nombre adicional
        order: 1,
      })
      .returning();

    // ⬅️ ELIMINADO: Lección 2 ya no existe

    console.log(`✅ 1 lección creada`);

    // ========================================
    // TEMAS PARA LECCIÓN 1 (6 temas nuevos)
    // ========================================

    // Tema 1: Presentaciones
    const [topic1] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Presentaciones",
        summary: "Aprende a presentarte y conocer a otras personas en inglés",
      })
      .returning();

    // Tema 2: Preguntas Comunes
    const [topic2] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Preguntas Comunes",
        summary:
          "Domina las preguntas más frecuentes en conversaciones básicas",
      })
      .returning();

    // Tema 3: Números
    const [topic3] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Números",
        summary: "Aprende a contar y usar números en inglés",
      })
      .returning();

    // Tema 4: Pronunciación
    const [topic4] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Pronunciación",
        summary: "Mejora tu pronunciación con sonidos básicos del inglés",
      })
      .returning();

    // Tema 5: Cognados
    const [topic5] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Cognados",
        summary: "Descubre palabras similares entre español e inglés",
      })
      .returning();

    // Tema 6: Despedidas
    const [topic6] = await db
      .insert(schema.topics)
      .values({
        lessonId: lesson1.id,
        title: "Despedidas",
        summary: "Aprende diferentes formas de despedirte en inglés",
      })
      .returning();

    console.log(`✅ 6 temas creados`);

    // ========================================
    // ACTIVIDADES PARA CADA TEMA
    // ========================================

    // Actividades para Tema 1: Presentaciones
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
          embedUrl:
            "https://quizlet.com/509361526/flashcards/embed?i=nd4dc&x=1jj1",
        },
      },
    ]);

    // Actividades para Tema 2: Preguntas Comunes
    await db.insert(schema.activities).values([
      {
        topicId: topic2.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=g9BERd6yRLI&t=2000s",
        },
      },
      {
        topicId: topic2.id,
        type: "quizlet",
        data: {
          embedUrl:
            "https://quizlet.com/509361526/flashcards/embed?i=nd4dc&x=1jj1",
        },
      },
    ]);

    // Actividades para Tema 3: Números
    await db.insert(schema.activities).values([
      {
        topicId: topic3.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=g9BERd6yRLI&t=2500s",
        },
      },
      {
        topicId: topic3.id,
        type: "quizlet",
        data: {
          embedUrl:
            "https://quizlet.com/509361526/flashcards/embed?i=nd4dc&x=1jj1",
        },
      },
    ]);

    // Actividades para Tema 4: Pronunciación
    await db.insert(schema.activities).values([
      {
        topicId: topic4.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=g9BERd6yRLI&t=3000s",
        },
      },
      {
        topicId: topic4.id,
        type: "quizlet",
        data: {
          embedUrl:
            "https://quizlet.com/509361526/flashcards/embed?i=nd4dc&x=1jj1",
        },
      },
    ]);

    // Actividades para Tema 5: Cognados
    await db.insert(schema.activities).values([
      {
        topicId: topic5.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=g9BERd6yRLI&t=3500s",
        },
      },
      {
        topicId: topic5.id,
        type: "quizlet",
        data: {
          embedUrl:
            "https://quizlet.com/509361526/flashcards/embed?i=nd4dc&x=1jj1",
        },
      },
    ]);

    // Actividades para Tema 6: Despedidas
    await db.insert(schema.activities).values([
      {
        topicId: topic6.id,
        type: "video",
        data: {
          videoUrl: "https://www.youtube.com/watch?v=g9BERd6yRLI&t=4000s",
        },
      },
      {
        topicId: topic6.id,
        type: "quizlet",
        data: {
          embedUrl:
            "https://quizlet.com/509361526/flashcards/embed?i=nd4dc&x=1jj1",
        },
      },
    ]);

    console.log(`✅ 12 actividades creadas (2 por cada tema)`);
    console.log("✨ Datos sembrados exitosamente!");
  } catch (error) {
    console.error("❌ Error al sembrar datos:", error);
    throw error;
  }
}

// Export for use in API endpoint
export async function seedDatabase() {
  return seedCourses();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCourses()
    .then(() => {
      console.log("🎉 ¡Siembra completada!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Siembra fallida:", error);
      process.exit(1);
    });
}

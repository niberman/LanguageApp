import { Lesson } from './Lesson';

export class Course {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public lessons: Lesson[] = []
  ) {}

  addLesson(lesson: Lesson) {
    this.lessons.push(lesson);
  }

  getProgress(): number {
    if (this.lessons.length === 0) return 0;
    const totalProgress = this.lessons.reduce((sum, lesson) => sum + lesson.getProgress(), 0);
    return totalProgress / this.lessons.length;
  }
}

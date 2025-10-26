import { Topic } from './Topic';

export class Lesson {
  constructor(
    public id: string,
    public title: string,
    public order: number,
    public topics: Topic[] = []
  ) {}

  addTopic(topic: Topic) {
    this.topics.push(topic);
  }

  getProgress(): number {
    if (this.topics.length === 0) return 0;
    const totalProgress = this.topics.reduce((sum, topic) => sum + topic.getProgress(), 0);
    return totalProgress / this.topics.length;
  }
}

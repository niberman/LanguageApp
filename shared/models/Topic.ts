import { Activity } from './Activity';

export class Topic {
  constructor(
    public id: string,
    public title: string,
    public summary: string,
    public activities: Activity[] = []
  ) {}

  addActivity(activity: Activity) {
    this.activities.push(activity);
  }

  getProgress(): number {
    if (this.activities.length === 0) return 0;
    const completedCount = this.activities.filter(a => a.completed).length;
    return completedCount / this.activities.length;
  }
}

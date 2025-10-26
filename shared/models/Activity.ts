export abstract class Activity {
  constructor(
    public id: string,
    public type: string,
    public completed = false
  ) {}

  complete() {
    this.completed = true;
  }
}

export class VideoActivity extends Activity {
  constructor(
    id: string,
    public videoUrl: string,
    completed = false
  ) {
    super(id, "video", completed);
  }
}

export class QuizletActivity extends Activity {
  constructor(
    id: string,
    public quizletId: string,
    completed = false
  ) {
    super(id, "quizlet", completed);
  }
}

export class AIChatActivity extends Activity {
  constructor(
    id: string,
    public promptSet: string[],
    completed = false
  ) {
    super(id, "aiChat", completed);
  }
}

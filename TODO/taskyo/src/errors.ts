import { ProgressBase } from "./progress";
import { Task } from "./task";

interface ErrorCtx {
  task: Task;
  subtask?: Task;
  progress: ProgressBase;
  original: unknown;
}

export class CriticalError extends Error {
  constructor(public readonly cause: ErrorCtx) {
    super("critical");
  }
}

export class AbortError extends Error {
  constructor() {
    super("abort");
  }
}

import { ProgressBase } from "./progress";
import { Task } from "./task";

interface ErrorTrace {
  task: Task;
  progress: ProgressBase;
}

interface ErrorCause extends ErrorTrace {
  source: unknown;
}

export class CriticalError extends Error {
  constructor(public readonly trace: [ErrorCause, ...ErrorTrace[]]) {
    super("critical");
  }
  get cause() {
    return this.trace[0];
  }
  get taskIds() {
    return this.trace.map((t) => t.task["Id"]);
  }
}

export const CRITIC = (err: unknown, cause: ErrorTrace) => {
  if (err instanceof CriticalError) {
    return new CriticalError([...err.trace, cause]);
  }
  return new CriticalError([{ ...cause, source: err }]);
};

export class AbortError extends Error {
  constructor() {
    super("abort");
  }
}

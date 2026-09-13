import { ProgressBase } from "./progress";
import { Task } from "./task";

interface ErrorTrace {
  task: Task;
  progress: ProgressBase;
}

interface ErrorCause<Source = unknown> extends ErrorTrace {
  source: Source;
}

export class CriticalError<Source = unknown> extends Error {
  constructor(public readonly trace: [ErrorCause<Source>, ...ErrorTrace[]]) {
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

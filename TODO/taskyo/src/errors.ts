import { ProgressBase } from "./progress";
import { Task, TaskAny, TaskRun } from "./task";

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
export const rrERROR = (err: unknown, cause: ErrorTrace) => {
  if (err instanceof CriticalError) {
    return new CriticalError([...err.trace, cause]);
  } else if (err instanceof TimeoutError) {
    return err;
  }
  return new CriticalError([{ ...cause, source: err }]);
};

export class AbortError extends Error {
  constructor() {
    super("abort");
  }
}

export class TimeoutError<T extends TaskAny = TaskAny, R extends TaskRun<T> = TaskRun<T>> extends Error {
  constructor(
    public readonly task: T,
    public readonly run: R,
  ) {
    super("timeout");
  }
}

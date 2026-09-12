export class CriticalError<Cause> extends Error {
  constructor(public readonly cause: Cause) {
    super("critical");
  }
}

export class AbortError extends Error {
  constructor() {
    super("abort");
  }
}

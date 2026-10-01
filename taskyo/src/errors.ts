import { ERRs, AsInstances } from "rrerrorr";
import type { Run, RetryRun } from "./run";
import { ARR, MsOrNumber, wait } from "jsyoyo";

export type ErrorLike = Error | { $: Error };
export type ErrorLikes = ARR<ErrorLike>;

type Runs = ARR<Run | RetryRun>;
export type ERR = AsInstances<typeof ERR>;
export const ERR = ERRs(($) => ({
  taskyo: {
    error: {
      retry: $<[task?: RetryRun]>(),
      abort: $<[task?: Run, reason?: unknown]>(),
      timeout: $<[task: Run]>(),
      critical: $<[error: unknown, runs: Runs]>(),
    },
  },
}))["taskyo"]["error"];

// ideally should be cancelled
export const timeout = (ms: MsOrNumber, run: Run) => wait(ms).then(() => ERR.timeout(run));

export const critical = (err: unknown, run: Run | RetryRun) => {
  if (err instanceof ERR.critical.$) {
    const ctx = err.ctx as never as [error: unknown, runs: (Run | RetryRun)[]];
    return ERR.critical(ctx[0], [...(ctx[1] as []), run]);
  }
  if (err instanceof Error && err.name.startsWith("taskyo.error")) {
    return err;
  }
  return ERR.critical(err, [run]);
};

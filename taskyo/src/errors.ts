import ERRs from "rrerrorr";
import type { Run, RetryRun } from "./run";
import { MsOrNumber, wait } from "jsyoyo";

export type ERR = typeof ERR;
export const ERR = ERRs(($) => ({
  taskyo: {
    error: {
      retry: $<[task?: RetryRun]>(),
      abort: $<[task?: Run, reason?: unknown]>(),
      timeout: $<[task: Run]>(),
      critical: $<[error: unknown, runs: (Run | RetryRun)[]]>(),
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
  return ERR.critical(err, [run]);
};

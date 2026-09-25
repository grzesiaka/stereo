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
      critical: $<[task?: Run, error?: unknown]>(),
    },
  },
}))["taskyo"]["error"];

// ideally should be cancelled
export const timeout = (ms: MsOrNumber, run: Run) => wait(ms).then(() => ERR.timeout(run));

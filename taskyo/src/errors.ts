import { ERRs, AsInstances } from "rrerrorr";
import type { Run, RetryRun } from "./run";
import { ARR, MsOrNumber, wait } from "jsyoyo";

export type ErrorLike = Error | { $: Error };
export type ErrorLikes = ARR<ErrorLike>;

type Trace = ARR<Run | RetryRun>;
export type ERR = AsInstances<typeof ERR>;
export const ERR = ERRs(($) => ({
  taskyo: {
    error: {
      retry: $<{ run: RetryRun }>(),
      abort: $<{ run?: Run; reason?: unknown }>(),
      timeout: $<{ trace: Trace }>(),
      critical: $<{ error: unknown; trace: Trace }>(),
    },
  },
}))["taskyo"]["error"];

// ideally should be cancellable
export const timeout = (ms: MsOrNumber, trace: Trace = []) => wait(ms).then(() => ERR.timeout({ trace })); // TODO - improve context

export const critical = (err: unknown, run: Run | RetryRun) => {
  if (err instanceof ERR.critical.$) {
    const ctx = err.ctx;
    return ERR.critical({
      error: ctx.error,
      trace: [...ctx.trace, run],
    });
  }
  if (err instanceof Error && err.name.startsWith("taskyo.error")) {
    return err;
  }
  return ERR.critical({ error: err, trace: [run] });
};

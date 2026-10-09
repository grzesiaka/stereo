import { ARR1, ifArray, MsOrNumber, wait } from "jsyoyo";
import { Result$ERR } from "./spec";
import { ERR } from "./errors";
import type { RetryRun } from "./run";

export type RetryFn<Result = unknown, Deps = unknown> = (
  errors: ARR1<Result$ERR<Result> | ERR["timeout"]>,
  deps: Deps,
  run: RetryRun,
) => MsOrNumber | Promise<unknown>;

export type RetryAfter = Array<MsOrNumber>;

export interface RetryWithExpBackoff {
  retries?: number;
  initDelay?: number;
  maxDelay?: number;
  exponent?: number;
  jitter?: boolean; // | (() => number);
}

export type RetryOptions<Result = unknown, Deps = unknown> =
  | RetryFn<Result, Deps>
  | RetryAfter
  | MsOrNumber
  | RetryWithExpBackoff;

export const ASAP = () => 0;

const failed = (run: RetryRun) => Promise.reject(ERR.retry({ run }));
export const withExpBackoff = (opt: RetryWithExpBackoff, run: RetryRun) => {
  let attempt = 0;
  return () => {
    if (opt.retries && attempt++ >= opt.retries) return failed(run);
    const ms = Math.min(opt.maxDelay || 60_000, (opt.initDelay || 1_000) * (opt.exponent || 2) ** attempt++);
    return wait(opt.jitter ? Math.random() * ms : ms);
  };
};

export const initRetry = (
  spec: {
    retry: RetryOptions;
    deps: any;
  },
  run: RetryRun,
): ((err: unknown) => Promise<unknown>) => {
  const retry = spec.retry;
  switch (typeof retry) {
    case "function":
      return (err: unknown) => {
        const errors = [] as unknown[];
        errors.unshift(err);
        const t = retry(errors as any, spec.deps, run);
        return typeof t === "number" ? wait(t) : t.catch(() => failed(run));
      };
    case "number":
      return () => wait(retry);
    case "object":
      return ifArray(
        retry,
        (r) => {
          let i = 0;
          return () => (i < r.length ? wait(r[i++]) : failed(run));
        },
        (r) => {
          return withExpBackoff(r, run);
        },
      );
  }
};

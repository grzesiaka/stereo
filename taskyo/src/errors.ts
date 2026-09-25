import ERRs from "rrerrorr";
import { RetryRun } from "./retry";
import { Run } from "./run";

export type ERR = typeof ERR;
export const ERR = ERRs(($) => ({
  taskyo: {
    error: {
      retry: $<[task?: RetryRun]>(),
      abort: $<[task?: Run, reason?: unknown]>(),
      timeout: $<[task?: Run]>(),
      critical: $<[task?: Run, error?: unknown]>(),
    },
  },
}))["taskyo"]["error"];

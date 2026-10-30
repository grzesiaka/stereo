import { AbortController, CtxIdOptional } from "jsyoyo";
import { Runner, runner } from "./runner";
import { SpecAny } from "./spec";
import { Run } from "./run";

export type Loop<S extends SpecAny, Ctx extends CtxIdOptional> = Runner<S, Ctx>;

export type LoopOnNext = "replace" | "ignore";

const replace = (run: () => Run | null, $: Runner): Run | null => {
  if ($.X.runs.size !== 0) {
    $.abort.abort();
    $.abort = new AbortController();
  }
  return run(); // Since abort is delivered via promise the updates are not perfect (['-', ...] comes before ['+', ...])
};
const ignore = (run: () => Run | null, $: Runner) => ($.X.runs.size === 0 ? run() : null);

export const loop = <P extends LoopOnNext>(policy = "replace" as P) => runner(policy === "replace" ? replace : ignore);

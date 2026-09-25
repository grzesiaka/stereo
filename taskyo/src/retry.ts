import { RRERRORR } from "rrerrorr";
import { LoadedSpec, Spec$ERR, Spec$OK, Spec$Params, SpecAny } from "./types";
import { $progress, fakeAbort } from "./utils";
import { ifFunction } from "jsyoyo";

export const retry =
  <S extends LoadedSpec>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): RetryRun<S> => {
    const ctx = ifFunction(spec.ctx, ($) => $(spec.deps));
    const progress = $progress(ctx, spec.deps, spec.update);

    const promise = spec.run(params, spec.deps, progress[1], abort, spec);

    const r = {
      spec,
      promise,
      //  progress: progress[0].O,
    } satisfies RetryRun<S>;

    return r;
  };
export interface RetryRun<S extends SpecAny = SpecAny> {
  spec: S;
  promise: Promise<
    | Spec$OK<S>
    | Spec$ERR<S>
    | (S extends { timeout: any } ? RRERRORR<"taskyo.error.timeout", [RetryRun<S>]> : never)
    | (S extends { retry: any } ? RRERRORR<"taskyo.error.retry", [RetryRun<S>]> : never)
  >;
}

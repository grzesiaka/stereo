import { ifFunction } from "jsyoyo";
import { $Progress, $progress, fakeAbort } from "./utils";
import type { LoadedSpec, Spec$Ctx, Spec$Deps, Spec$ERR, Spec$OK, Spec$Params, SpecAny } from "./types";
import { retry, RetryRun } from "./retry";
import { RRERRORR } from "rrerrorr";

export const run =
  <S extends LoadedSpec>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): S extends { retry: any } ? RetryRun<S> : Run<S> => {
    if (spec.retry) return retry(spec)(params, abort) as never;

    const ctx = ifFunction(spec.ctx, ($) => $(spec.deps));
    const progress = $progress(ctx, spec.deps, spec.update);

    let promise = spec.run(params, spec.deps, progress[1], abort, spec);

    const r = {
      spec,
      promise,
      progress: progress[0].O,
    } satisfies Run<S>;

    return r as never;
  };

export interface Run<S extends SpecAny = SpecAny> {
  spec: S;
  promise: Promise<
    Spec$OK<S> | Spec$ERR<S> | (S extends { timeout: any } ? RRERRORR<"taskyo.error.timeout", [Run<S>]> : never)
  >;
  progress: $Progress<Spec$Ctx<S>, Spec$Deps<S>>[0]["O"];
}

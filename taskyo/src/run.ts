import { ifFunction, ON } from "jsyoyo";
import { $Progress, $progress, fakeAbort } from "./utils";
import type { LoadedSpec, Spec$Ctx, Spec$Deps, Spec$ERR, Spec$OK, Spec$Params, SpecAny } from "./types";

import { RRERRORR } from "rrerrorr";
import { ERR, timeout } from "./errors";

const retry =
  <S extends LoadedSpec>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): Run<S> => {
    const ctx = ifFunction(spec.ctx, ($) => $(spec.deps));
    const progress = $progress(ctx, spec.deps, spec.update);
    const abo = ON.promise(abort)("abort");
    const r = {
      spec,
      progress: progress[0].O,
    } as Run<S>;

    const promise = [spec.run(params, spec.deps, progress[1], (f) => abo.then(f), spec), abo];
    if (spec.timeout) {
      promise.push(timeout(spec.timeout, r));
    }

    r.promise = Promise.race(promise);

    return r as never;
  };

const run1 =
  <S extends LoadedSpec>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): Run<S> => {
    const ctx = ifFunction(spec.ctx, ($) => $(spec.deps));
    const progress = $progress(ctx, spec.deps, spec.update);
    const abo = ON.promise(abort)("abort");
    const r = {
      spec,
      progress: progress[0].O,
    } as Run<S>;

    const promise = [spec.run(params, spec.deps, progress[1], (f) => abo.then(f), spec), abo.then(() => ERR.abort(r))];
    if (spec.timeout) {
      promise.push(timeout(spec.timeout, r));
    }

    r.promise = Promise.race(promise);

    return r as never;
  };

export interface Run<S extends SpecAny = SpecAny> {
  spec: S;
  promise: Promise<
    | Spec$OK<S>
    | Spec$ERR<S>
    | RRERRORR<ERR["abort"]["$"]["name"], [Run<S>]>
    | (S extends { timeout: any } ? RRERRORR<ERR["timeout"]["$"]["name"], [Run<S>]> : [[S["timeout"]]])
  >;
  progress: $Progress<Spec$Ctx<S>, Spec$Deps<S>>[0]["O"];
}

export interface RetryRun<S extends SpecAny = SpecAny> {
  spec: S;
  promise: Promise<
    | Spec$OK<S>
    | Spec$ERR<S>
    | RRERRORR<ERR["abort"]["$"]["name"], [Run<S>]>
    | (S extends { timeout: any } ? RRERRORR<ERR["timeout"]["$"]["name"], [Run<S>]> : never)
    | (S extends { retry: any } ? RRERRORR<ERR["retry"]["$"]["name"], [RetryRun<S>]> : never)
  >;
}

export const run =
  <S extends LoadedSpec>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort) =>
    (spec.retry ? retry : run1)(spec)(params, abort) as S extends { retry: any } ? RetryRun<S> : Run<S>;

run[1] = run1;

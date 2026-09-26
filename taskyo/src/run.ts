import { a, deferred, ifFunction, MsOrNumber, ON } from "jsyoyo";
import { $State, $state, fakeAbort, load1 } from "./utils";
import type { LoadedSpec, Spec$State, Spec$Deps, Spec$ERR, Spec$OK, Spec$Params, SpecAny, RetryOptions } from "./types";

import { RRERRORR } from "rrerrorr";
import { critical, ERR, timeout } from "./errors";

type RetryRunResult<S extends SpecAny> =
  | Spec$OK<S>
  | Spec$ERR<S>
  | RRERRORR<ERR["abort"]["$"]["name"], [Run<S>]>
  | (S extends { timeout: MsOrNumber } ? RRERRORR<ERR["timeout"]["$"]["name"], [Run<S>]> : never)
  | (S extends { retry: any } ? RRERRORR<ERR["retry"]["$"]["name"], [RetryRun<S>]> : never);
export interface RetryRun<S extends SpecAny = SpecAny> {
  spec: S;
  promise: Promise<RetryRunResult<S>>;
  state: $State<Spec$State<S> & { runs: [Run<S>, ...Run<S>[]] }, Spec$Deps<S>>[0]["O"];
}

const retry =
  <S extends LoadedSpec & { retry: RetryOptions }>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): Run<S> => {
    const _state = ifFunction(
      spec.state,
      ($) => $(spec.deps),
      (x) => ({ ...x }),
    );
    const def = deferred<RetryRunResult<S>>();
    const state = $state(a(_state, { runs: [] }), spec.deps, spec.update);
    const abo = ON.promise(abort)("abort");
    const r = {
      spec,
      state: state[0].O,
    } as RetryRun<S>;

    const promise = [def.promise, abo] as Promise<RetryRunResult<S>>[];
    if (spec.timeout) {
      // TODO figure out how timeout should behave exactly; should be for all retry-run or for each run
      promise.push(timeout(spec.timeout, r) as Promise<RetryRunResult<S>>);
    }
    r.promise = Promise.race(promise);

    let stopObserving = () => 1 as unknown;
    const run = (): Promise<unknown> => {
      stopObserving();
      const r1 = run1(spec)(params, abort);
      stopObserving = r1.state(state[1]);
      return r1.promise
        .then((x) => {
          if (x instanceof Error) {
            return spec.retry(x, spec.deps, r).then(run);
          }
          def.resolve(x as any);
          return x;
        })
        .catch((err) => {
          throw critical(err, r);
        });
    };

    run();

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
  state: $State<Spec$State<S>, Spec$Deps<S>>[0]["O"];
}

const run1 =
  <S extends LoadedSpec>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): Run<S> => {
    const _state = ifFunction(
      spec.state,
      ($) => $(spec.deps),
      (x) => ({ ...x }),
    );
    const state = $state(_state, spec.deps, spec.update);
    const abo = ON.promise(abort)("abort");
    const r = {
      spec,
      state: state[0].O,
    } as Run<S>;

    const promise = [spec.run(params, spec.deps, state[1], (f) => abo.then(f), spec), abo.then(() => ERR.abort(r))];
    if (spec.timeout) {
      promise.push(timeout(spec.timeout, r));
    }

    r.promise = Promise.race(promise);

    return r as never;
  };

export type Spec$Run<S extends SpecAny> = S extends { deps: any }
  ? S extends { retry: any }
    ? RetryRun<S>
    : Run<S>
  : Promise<S extends { retry: any } ? RetryRun<S> : Run<S>>;

export const run =
  <S extends SpecAny>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): Spec$Run<S> =>
    "deps" in spec
      ? ((spec.retry ? retry : run1)(spec as any)(params, abort) as never)
      : (load1(spec).then((s) => (spec.retry ? retry : run1)(s as any)(params, abort)) as never);

run[1] = run1;

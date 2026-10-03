import { __, a, deferred, Fn$O, ifFunction, MsOrNumber, ON } from "jsyoyo";
import { $State, $state, fakeAbort, load1 } from "./utils";
import type {
  LoadedSpec,
  Spec$State,
  Spec$Deps,
  Spec$ERR,
  Spec$OK,
  Spec$Params,
  RetryOptions,
  Spec,
  SpecOptions,
} from "./spec";

import { RRERRORR } from "rrerrorr";
import { critical, ERR, timeout } from "./errors";
import { CACHE, CacheService } from "./cache";

type RetryRunResult<S extends LoadedSpec | Spec> =
  | Spec$OK<S>
  | Spec$ERR<S>
  | RRERRORR<ERR["abort"]["name"], [Run<S>]>
  | (S extends { timeout: MsOrNumber } ? RRERRORR<ERR["timeout"]["name"], [Run<S>]> : never)
  | (S extends { retry: any } ? RRERRORR<ERR["retry"]["name"], [RetryRun<S>]> : never);
export interface RetryRun<S extends LoadedSpec | Spec = Spec | LoadedSpec> {
  spec: S;
  promise: Promise<RetryRunResult<S>>;
  state: $State<Spec$State<S> & { runs: [Run<S>, ...Run<S>[]] }, Spec$Deps<S>>[0]["O"];
  cached?: boolean;
}

type InitRun = Fn$O<typeof initRun>;
const initRun = <R extends Run = Run>(spec: LoadedSpec) => {
  const r = {} as R;
  const _state = ifFunction(
    spec.state,
    ($) => $(spec.deps),
    (x) => ({ ...x }),
  );
  const state = $state(a(_state, spec.retry ? { runs: [] } : []), spec.deps, spec.update);
  r.spec = spec;
  r.state = state[0].O;
  return [r, state] as [run: R, state: typeof state];
};

const retry =
  <S extends LoadedSpec & { retry: RetryOptions }>(spec: S, [r, state] = initRun(spec)) =>
  (params: Spec$Params<S>, abort = fakeAbort): Run<S> => {
    const def = deferred<RetryRunResult<S>>();

    const abo = ON.promise(abort)("abort");
    const promise = [def.promise, abo] as Promise<RetryRunResult<S>>[];
    // if (spec.timeout) {
    //   // TODO spec.timeout controls timeout of single run + retry timeout in retry options
    //   promise.push(timeout(spec.timeout, r) as Promise<RetryRunResult<S>>);
    // }
    r.promise = Promise.race(promise);

    let stopObserving = () => 1 as unknown;
    const run = (): Promise<unknown> => {
      stopObserving();
      const r1 = run1(spec)(params, abort);
      stopObserving = r1.state(state[1]);
      return r1.promise
        .then((x) => {
          if (x instanceof Error) {
            return spec.retry(x, spec.deps /* r */).then(run);
          }
          def.resolve(x);
          return x;
        })
        .catch((err) => {
          throw critical(err, r);
        })
        .finally(stopObserving);
    };

    run();

    return r as never;
  };

export interface Run<S extends LoadedSpec | Spec = Spec | LoadedSpec> {
  spec: S;
  promise: Promise<
    | Spec$OK<S>
    | Spec$ERR<S>
    | RRERRORR<ERR["abort"]["name"], [Run<S>]>
    | (S extends { timeout: any } ? RRERRORR<ERR["timeout"]["name"], [Run<S>]> : never)
  >;
  state: $State<Spec$State<S>, Spec$Deps<S>>[0]["O"];
  cached?: boolean;
}

const run1 =
  <S extends LoadedSpec>(spec: S, [r, state] = initRun(spec)) =>
  (params: Spec$Params<S>, abort = fakeAbort): Run<S> => {
    const abo = ON.promise(abort)("abort");

    let run: Run | Promise<Run>;
    try {
      run = spec.run(params, spec.deps, state[1], (f) => abo.then(f), spec);
    } catch (e) {
      throw critical(e, r);
    }

    const promise = [run, abo.then(() => ERR.abort(r))];
    if (spec.timeout) {
      promise.push(timeout(spec.timeout, [r]) as never);
    }

    r.promise = (
      spec.cache
        ? Promise.race(promise).then((x) => {
            if (!(x instanceof Error)) {
              setCache(spec, params, x);
            }
            return x;
          })
        : Promise.race(promise)
    ).catch((e) => {
      throw critical(e, r);
    });

    return r as never;
  };

export type Spec$Run<S extends Spec> = S extends { deps: any }
  ? S extends { cache: any }
    ? Promise<S extends { retry: any } ? RetryRun<S> : Run<S>>
    : S extends { retry: any }
      ? RetryRun<S>
      : Run<S>
  : Promise<S extends { retry: any } ? RetryRun<S> : Run<S>>;

export const run =
  <S extends Spec & SpecOptions>(spec: S, onLoaded?: (...r: InitRun) => void) =>
  (params: Spec$Params<S>, abort = fakeAbort): Spec$Run<S> => {
    if (("deps" in spec || !("load" in spec)) && !("cache" in spec)) {
      const i = initRun(spec as never as LoadedSpec);
      onLoaded?.(...i);
      return (spec.retry ? retry : run1)(spec as any, i)(params, abort) as never;
    }
    return load1(spec).then(async (s) => {
      const i = initRun(spec as never as LoadedSpec);
      onLoaded?.(...i);
      const cached = await getCached(s as any, params);

      if (cached !== __) {
        const i = initRun(s as any);
        const t = i[1][0].X.total;
        if (t !== __) {
          i[1][1]({ curr: t });
        }
        i[0].promise = Promise.resolve(cached);
        i[0].cached = true;
        return i[0];
      }
      return (spec.retry ? retry : run1)(s as any, i)(params, abort);
    }) as never;
  };

run[1] = run1;

const getCached = (spec: LoadedSpec, params: Spec$Params<typeof spec>) => {
  if (spec.cache) {
    const key = spec.cache.key(params, spec.deps, spec.Id);
    const prefix = "prefix" in spec.cache ? spec.cache.prefix || "" : CACHE.config().prefix;
    return Promise.all(
      spec.cache.stores.map((s: any) => (CACHE.registry[s as never] as CacheService).get(key, prefix)),
    ).then((vs) => {
      for (let v of vs) {
        if (v !== __) return v;
      }
      return __;
    });
  }
  return __;
};

const setCache = (spec: LoadedSpec, params: Spec$Params<typeof spec>, value: unknown) => {
  const key = spec.cache!.key(params, spec.deps, spec.Id);
  const prefix = "prefix" in spec.cache! ? spec.cache.prefix || "" : CACHE.config().prefix;
  for (let v of spec.cache!.stores) {
    (CACHE.registry[v as never] as CacheService).set(key, value, prefix, spec.cache!.ttl);
  }
};

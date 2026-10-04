import { Var } from "ioioy";
import { AbortSignal, dethunk, $$, __, ifFunction } from "jsyoyo";
import { Tree, awaiT, map } from "treeo";

import type { Load, Load$Deps, LoadedSpec, StateRunFn, RunState } from "./spec";
import { Simplify } from "type-fest";
import { spec } from "./spec";

export const loadDeps = awaiT.$(dethunk) as <T extends $$<Load>>(d: T) => $$<Load$Deps<T>>;

type Loadable =
  | {}
  | {
      load?: __<Load>;
    };

type LoadSpec<S extends Loadable> = Simplify<
  S & {
    deps: S extends { load: any } ? Load$Deps<S["load"]> : __;
  }
>;

export const load1 = <S extends Loadable>(spec: S) =>
  ((spec as any).load
    ? ifFunction(
        (spec as any).load,
        (x) => x(),
        () => (loadDeps as any)((spec as any).load),
      )
    : Promise.resolve(__)
  ).then((deps: any) => {
    (spec as never as LoadedSpec).deps = deps;
    return spec as never;
  }) as Promise<LoadSpec<S>>;

export type LoadSpecs<T extends Tree<Loadable>> = T extends Loadable
  ? LoadSpec<T>
  : { [K in keyof T]: LoadSpecs<T[K] & Tree<Loadable>> };

export const load = <T extends Tree<Loadable>>(specs: T) =>
  awaiT(
    map(
      ([s]) => load1(s as Loadable),
      // @ts-expect-error should prove `i is object`, but it is handled by the accepted type (Tree<SpecAny>)
      (i) => !spec.is(i),
    )(specs) as never,
  ) as never as LoadSpecs<T>;

export const fakeAbort = new Proxy({} as any, { get: () => () => 1 }) as AbortSignal;

export type $State<State extends RunState, Deps> = ReturnType<typeof $state<State, Deps>>;
export const $state = <State extends RunState, Deps>(
  state: State,
  deps: Deps,
  update?: (state: State, deps: Deps) => void,
) => {
  const v = Var(state);
  return [
    v,
    (u?: Partial<State>) => {
      if (!u) return v.X;
      const x = {
        ...v.X,
        ...u,
      };
      update?.(x, deps);
      return v.I(x);
    },
  ] as [typeof v, StateRunFn<State>];
};

export const percent = (dividend: number, divisor = 1) => Math.round((100 * dividend) / divisor);

// import { timeout } from "./errors";
// export const orTimeout = <const Ms extends MsOrNumber, S extends ARR<Spec>>(ms: Ms, ...specs: S) =>
//   parallel([spec()(() => timeout(ms))(), ...specs]);

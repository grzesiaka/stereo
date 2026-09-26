import { Var } from "ioioy";
import { AbortSignal, dethunk, $$, __ } from "jsyoyo";
import { Tree, awaiT, map } from "treeo";

import type { Load, Load$Deps, LoadedSpec, LoadSpec, LoadSpecs, ProgressRunFn, RunState, SpecAny } from "./types";
import { isSpec } from "./spec";

export const asERR = <P>(p: P) => p as Extract<P, Error>;
export const asOK = <P>(p: P) => p as Exclude<P, Error>;

export const loadDeps = awaiT.$(dethunk) as <T extends $$<Load>>(d: T) => $$<Load$Deps<T>>;

export const load1 = <S extends SpecAny>(spec: S) =>
  (spec.load ? loadDeps(spec.load) : Promise.resolve(__)).then((deps) => {
    (spec as never as LoadedSpec).deps = deps;
    return spec as never as LoadSpec<S>;
  });

export const load = <T extends Tree<SpecAny>>(specs: T) =>
  awaiT(
    map(
      ([s]) => load1(s as SpecAny),
      // @ts-expect-error should prove `i is object`, but it is handled by the accepted type (Tree<SpecAny>)
      (i) => !isSpec(i),
    )(specs) as never,
  ) as never as LoadSpecs<T>;

export const fakeAbort = new Proxy({} as any, { get: () => () => 1 }) as AbortSignal;

export type $Progress<State extends RunState, Deps> = ReturnType<typeof $progress<State, Deps>>;
export const $progress = <State extends RunState, Deps>(
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
  ] as [typeof v, ProgressRunFn<State>];
};

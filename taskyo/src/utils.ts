import { Var } from "ioioy";
import { AbortSignal, dethunk, $$, __ } from "jsyoyo";
import { Tree, awaiT, map } from "treeo";

import type {
  Load,
  Load$Deps,
  LoadedSpec,
  LoadSpec,
  LoadSpecs,
  ProgressRunFn,
  RunContext,
  Spec,
  SpecAny,
} from "./types";

export const loadDeps = awaiT.$(dethunk) as <T extends $$<Load>>(d: T) => $$<Load$Deps<T>>;

export const load1 = <S extends SpecAny>(spec: S) =>
  (spec.load ? loadDeps(spec.load) : Promise.resolve(__)).then((deps) => {
    (spec as never as LoadedSpec).deps = deps;
    return spec as never as LoadSpec<S>;
  });

export const isSpec = (s: object): s is Spec => "run" in s && "Id" in s;

export const load = <T extends Tree<SpecAny>>(specs: T) =>
  awaiT(
    map(
      ([s]) => load1(s as SpecAny),
      // @ts-expect-error should prove `i is object`, but it is handled by the accepted type (Tree<SpecAny>)
      (i) => !isSpec(i),
    )(specs) as never,
  ) as never as LoadSpecs<T>;

export const fakeAbort = new Proxy({} as any, { get: () => () => 1 }) as AbortSignal;

export type $Progress<Ctx extends RunContext, Deps> = ReturnType<typeof $progress<Ctx, Deps>>;
export const $progress = <Ctx extends RunContext, Deps>(
  ctx: Ctx,
  deps: Deps,
  update?: (ctx: Ctx, deps: Deps) => void,
) => {
  const v = Var(ctx);
  return [
    v,
    (u?: Partial<Ctx>) => {
      if (!u) return v.X;
      const x = {
        ...v.X,
        ...u,
      };
      update?.(x, deps);
      return v.I(x);
    },
  ] as [typeof v, ProgressRunFn<Ctx>];
};

import { $$, __, AbortSignal, ARR, dethunk, FirstMatch, Json, Millisecond, MsOrNumber } from "jsyoyo";
import { Var } from "ioioy";
import { ERRs } from "rrerrorr";
import { Tree, Dethunk, awaiT, AwaiTreed } from "treeo";
import { fakeAbort } from "./utils";

type ErrorLike = Error | { $: Error };
type ErrorLikes = ARR<ErrorLike>;

type Load = __ | (Tree<Json | (() => Json) | (() => Promise<unknown>)> & { ERR?: () => Promise<ErrorLikes> });
type Load$Deps<Lo extends Load> = __ extends Lo ? __ : AwaiTreed<Dethunk<Lo>>;

interface RunContext {
  curr?: number;
  total?: number;
}
type Load$Ctx<Lo extends Load, Ctx extends RunContext> = (deps: Load$Deps<Lo>) => Ctx;
type UpdateFn<Lo extends Load, Ctx extends RunContext> = __ | ((ctx: Ctx, deps: Load$Deps<Lo>) => void);

type Progress<Ctx extends RunContext> = (u?: Partial<Ctx>) => Ctx;

type RunFn<Params, Result, Lo extends Load, Ctx extends RunContext> = (
  params: Params,
  deps: Load$Deps<Lo>,
  progress: Progress<Ctx>,
  abort: AbortSignal,
  spec: LoadedSpec<string, Params, Result, Lo, Ctx>,
) => Result;

export interface SpecExtra {
  Id?: string;
  // max time of execution
  timeout?: MsOrNumber;
  // expected time of execution
  ms?: MsOrNumber;
  cache?: "TODO";
  retry?: "TODO";
}

export interface Spec<
  Id extends string = string,
  Params = unknown,
  Result = unknown,
  Lo extends __<Load> = __,
  Ctx extends RunContext = RunContext,
> extends SpecExtra {
  Id: Id;
  load: Lo;
  ctx: Load$Ctx<Lo, Ctx>;
  update: UpdateFn<Lo, Ctx>;
  run: RunFn<Params, Result, Lo, Ctx>;
}

export interface LoadedSpec<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  Ctx extends RunContext = any,
> extends Spec<Id, Params, Result, Lo, Ctx> {
  deps: Load$Deps<Lo>;
}

export type LoadSpec<S extends SpecAny> = LoadedSpec<
  S["Id"],
  Spec$Params<S>,
  Spec$Result<S>,
  Spec$Deps<S>,
  Spec$Ctx<S>
>;

export interface SpecAny<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  Ctx extends RunContext = any,
> extends Spec<Id, Params, Result, Lo, Ctx> {}

export type PartialSpec<
  Id extends string = string,
  Params = unknown,
  Result = unknown,
  Lo extends __<Load> = __,
  Ctx extends RunContext = RunContext,
> = Partial<Spec<Id, Params, Result, Lo, Ctx>>;

// type Spec$Id<S> = S extends SpecAny<infer X> ? X : never;
type Spec$Params<S> = S extends SpecAny<string, infer X> ? X : never;
type Spec$Result<S> = S extends SpecAny<string, any, infer X> ? X : never;
type Spec$Deps<S> = S extends SpecAny<string, any, any, infer X> ? X : never;
type Spec$Ctx<S> = S extends SpecAny<string, any, any, any, infer X> ? X : never;

export const spec =
  <const Proto extends PartialSpec>(proto = {} as Proto) =>
  <Lo extends Load = __, Ctx extends RunContext = RunContext>(
    load = __ as Lo,
    ctx = (() => ({}) as Ctx) as Load$Ctx<Lo, Ctx>,
    update = __ as UpdateFn<Lo, Ctx>,
  ) =>
  <Params, Result, const RunExtra extends SpecExtra>(run: RunFn<Params, Result, Lo, Ctx>, runExtra = {} as RunExtra) =>
  <const Id extends Proto & RunExtra extends { Id: string } ? [string?] : [string]>(...[Id]: Id) =>
    ({
      ...proto,
      ...runExtra,
      Id: Id || runExtra["Id"] || proto["Id"] || "",
      load,
      ctx,
      update,
      run,
    }) satisfies Spec as never as Spec<
      FirstMatch<[Id[0], RunExtra["Id"], Proto["Id"]], string>,
      Params,
      Result,
      Lo,
      Ctx
    >;

export const load = awaiT.$(dethunk) as <T extends $$<Load>>(d: T) => $$<Load$Deps<T>>;

export const loadSpec = <S extends SpecAny>(spec: S) =>
  (spec.load ? load(spec.load) : Promise.resolve(__)).then((deps) => {
    (spec as never as LoadedSpec).deps = deps;
    return spec as never as LoadSpec<S>;
  });

type $Progress<Ctx extends RunContext, Deps> = ReturnType<typeof $progress<Ctx, Deps>>;
const $progress = <Ctx extends RunContext, Deps>(ctx: Ctx, deps: Deps, update?: (ctx: Ctx, deps: Deps) => void) => {
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
  ] as [typeof v, Progress<Ctx>];
};

export const run =
  <S extends LoadedSpec>(spec: S) =>
  (params: Spec$Params<S>, abort = fakeAbort): Run<S> => {
    const ctx = spec.ctx(spec.deps);
    const progress = $progress(ctx, spec.deps, spec.update);

    const promise = spec.run(params, spec.deps, progress[1], abort, spec);

    const r = {
      spec,
      promise,
      progress,
    } satisfies Run<S>;

    return r;
  };

interface Run<S extends Spec = Spec> {
  spec: S;
  promise: Promise<Spec$Result<S>>;
  progress: $Progress<Spec$Ctx<S>, Spec$Deps<S>>;
}

interface RetryInfo {
  count: number;
  total?: number;
}

export const ERR = ERRs(($) => ({
  taskyo: {
    error: {
      retry: $<[task?: Run, retryInfo?: RetryInfo]>(),
      abort: $<[task?: Run, reason?: unknown]>(),
      timeout: $<[task?: Run, timeout?: Millisecond]>(),
      critical: $<[task?: Run, error?: unknown]>(),
    },
  },
}))["taskyo"]["error"];

import type { __, ARR, AbortSignal, Json, MsOrNumber } from "jsyoyo";

import type { Tree, Dethunk, AwaiTreed } from "treeo";

export type ErrorLike = Error | { $: Error };
export type ErrorLikes = ARR<ErrorLike>;

export type Load = __ | (Tree<Json | (() => Json) | (() => Promise<unknown>)> & { ERR?: () => Promise<ErrorLikes> });
export type Load$Deps<Lo extends Load> = __ extends Lo ? __ : AwaiTreed<Dethunk<Lo>>;

export interface RunContext {
  curr?: number;
  total?: number;
}
export type Load$Ctx<Lo extends Load, Ctx extends RunContext> = (deps: Load$Deps<Lo>) => Ctx;
export type UpdateFn<Lo extends Load, Ctx extends RunContext> = __ | ((ctx: Ctx, deps: Load$Deps<Lo>) => void);

export type ProgressRunFn<Ctx extends RunContext> = (u?: Partial<Ctx>) => Ctx;

export type RunFn<Params, Result, Lo extends Load, Ctx extends RunContext> = (
  params: Params,
  deps: Load$Deps<Lo>,
  progress: ProgressRunFn<Ctx>,
  abort: AbortSignal,
  spec: LoadedSpec<string, Params, Result, Lo, Ctx>,
) => Result | readonly [Result, () => void];

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
  ctx: Ctx | Load$Ctx<Lo, Ctx>;
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

export type LoadSpecs<T extends Tree<SpecAny>> = T extends SpecAny
  ? LoadSpec<T>
  : { [K in keyof T]: LoadSpecs<T[K] & Tree<SpecAny>> };

export interface SpecAny<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  Ctx extends RunContext = any,
> extends Spec<Id, Params, Result, Lo, Ctx> {}

export type PartialSpec<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  Ctx extends RunContext = any,
> = Partial<Spec<Id, Params, Result, Lo, Ctx>>;

export type Spec$Params<S> = S extends SpecAny<string, infer X> ? X : never;
export type Spec$Result<S> = S extends SpecAny<string, any, infer X> ? X : never;
export type Spec$Deps<S> = S extends SpecAny<string, any, any, infer X> ? X : never;
export type Spec$Ctx<S> = S extends SpecAny<string, any, any, any, infer X> ? X : never;

export type Spec$OK<S> = Exclude<Awaited<Spec$Result<S>>, Error>;
export type Spec$ERR<S> = Extract<Awaited<Spec$Result<S>>, Error>;

import { Simplify } from "type-fest";
import type { __, ARR, Json, MsOrNumber } from "jsyoyo";

import type { Tree, Dethunk, AwaiTreed } from "treeo";
import { RetryRun, Run } from "./run";

export type ErrorLike = Error | { $: Error };
export type ErrorLikes = ARR<ErrorLike>;

export type Load = __ | (Tree<Json | (() => Json) | (() => Promise<unknown>)> & { ERR?: () => Promise<ErrorLikes> });
export type Load$Deps<Lo extends Load> = __ extends Lo ? __ : AwaiTreed<Dethunk<Lo>>;

export interface RunState {
  curr?: number;
  total?: number;
}
export type Load$State<Lo extends Load, State extends RunState> = (deps: Load$Deps<Lo>) => State;
export type UpdateFn<Lo extends Load, State extends RunState> = __ | ((state: State, deps: Load$Deps<Lo>) => void);

export type ProgressRunFn<State extends RunState> = (u?: Partial<State>) => State;

export type RunFn<Params, Result, Lo extends Load, State extends RunState> = (
  params: Params,
  deps: Load$Deps<Lo>,
  progress: ProgressRunFn<State>,
  onabort: (dispose: () => void) => void,
  spec: LoadedSpec<string, Params, Result, Lo, State>,
) => Result | readonly [Result, () => void];

type RetryOptions<S extends SpecAny = SpecAny> = (
  lastFailed: Run<S>,
  deps: Spec$Deps<S>,
  self: RetryRun<S>,
) => Promise<unknown>;

export interface SpecExtra<S extends SpecAny = SpecCore> {
  Id?: string;
  // max time of execution
  timeout?: MsOrNumber;
  // expected time of execution
  ms?: MsOrNumber;
  cache?: "TODO";
  retry?: RetryOptions<S>;
}

export interface SpecCore<
  Params = unknown,
  Result = unknown,
  Lo extends __<Load> = __,
  State extends RunState = RunState,
> {
  Id: string;
  load?: Lo;
  state: State | Load$State<Lo, State>;
  update?: UpdateFn<Lo, State>;
  run: RunFn<Params, Result, Lo, State>;
}

export type Spec<
  Id extends string = string,
  Params = unknown,
  Result = unknown,
  Lo extends __<Load> = __,
  State extends RunState = {},
  Extra extends SpecExtra = SpecExtra,
> = Simplify<{ Id: Id } & SpecCore<Params, Result, Lo, State> & Extra>;

export interface LoadedSpec<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  State extends RunState = any,
> extends Spec<Id, Params, Result, Lo, State> {
  deps: Load$Deps<Lo>;
}

export type LoadSpec<S extends SpecAny> = LoadedSpec<
  S["Id"],
  Spec$Params<S>,
  Spec$Result<S>,
  Spec$Deps<S>,
  Spec$State<S>
> &
  S;

export type LoadSpecs<T extends Tree<SpecAny>> = T extends SpecAny
  ? LoadSpec<T>
  : { [K in keyof T]: LoadSpecs<T[K] & Tree<SpecAny>> };

export interface SpecAny<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  State extends RunState = any,
> extends Spec<Id, Params, Result, Lo, State> {}

export type PartialSpec<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  State extends RunState = any,
> = Partial<Spec<Id, Params, Result, Lo, State>>;

export type Spec$Params<S> = S extends SpecAny<string, infer X> ? X : never;
export type Spec$Result<S> = S extends SpecAny<string, any, infer X> ? X : never;
export type Spec$Deps<S> = S extends SpecAny<string, any, any, infer X> ? X : never;
export type Spec$State<S> = S extends SpecAny<string, any, any, any, infer X> ? X : never;

export type Spec$OK<S> = Exclude<Awaited<Spec$Result<S>>, Error>;
export type Spec$ERR<S> = Extract<Awaited<Spec$Result<S>>, Error>;

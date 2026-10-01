import { __, Fn$O, Json, MsOrNumber } from "jsyoyo";

import { ERR, ErrorLikes } from "./errors";
import { Simplify } from "type-fest";
import { AwaiTreed, Dethunk, Tree } from "treeo";
import { CacheOption, CacheStore } from "./cache";

export type Load =
  | __
  | (() => Promise<unknown>)
  | (Tree<Json | (() => Json) | (() => Promise<unknown>)> & { ERR?: () => Promise<ErrorLikes> });
export type Load$Deps<Lo extends Load> = __ extends Lo
  ? __
  : Lo extends () => Promise<infer X>
    ? X
    : AwaiTreed<Dethunk<Lo>>;

export type LoadedSpec<S extends SpecAny = SpecAny, O extends SpecOptions = SpecOptions> = S &
  O & {
    deps: S extends { load?: __<Load> } ? Load$Deps<S["load"]> : __;
  };

export type RetryOptions<Result = unknown, Deps = unknown, Err = unknown> = (
  err: Err | Result$ERR<Result>,
  deps: Deps,
) => Promise<unknown>;

export type StateRunFn<State extends RunState> = (u?: Partial<State>) => State;
export type RunFn<Params, Result, Lo extends Load, State extends RunState> = (
  params: Params,
  deps: Load$Deps<Lo>,
  state: StateRunFn<State>,
  onabort: (dispose: () => void) => void,
  spec: LoadedSpec<SpecAny<string, Params, Result, Lo, State>>,
) => Result;

export interface RunState {
  [k: PropertyKey]: unknown;
  curr?: number;
  total?: number;
}

export type Spec$RunState<S> = S extends { state: any } ? ToRunState<S["state"]> : {};

export type RunStateOption<Deps> = RunState | ((deps: Deps) => RunState);

export type ToRunState<O extends RunStateOption<any>> = Fn$O<O, O> & RunState;
export type UpdateFn<State, Deps> = (state: State, deps: Deps) => void;

export interface SpecOptions<Timeout extends __<MsOrNumber> = __<MsOrNumber>, Params = any, Result = any, Deps = any> {
  Id?: string;
  timeout?: Timeout;
  avgTime?: MsOrNumber;
  retry?: RetryOptions<Result, Deps, Timeout extends 0 | __ ? never : ERR["timeout"]>;
  cache?: {
    key: (p: Params, deps: Deps, taskId: string) => string;
    stores: CacheStore[];
  } & CacheOption;
}

export interface SpecCore<
  Params = unknown,
  Result = unknown,
  Lo extends Load = __,
  State extends RunStateOption<Load$Deps<Lo>> = RunStateOption<Load$Deps<Lo>>,
  Update extends __ | UpdateFn<ToRunState<State>, Load$Deps<Lo>> = __,
> {
  run: RunFn<Params, Result, Lo, ToRunState<State>>;
  state: State;
  load: Lo;
  update: Update;
}

export type Spec<
  Id extends string = string,
  Core = SpecAny,
  Options = SpecOptions,
  Spec = { Id: Id } & Core & Options,
> = Simplify<{
  [K in keyof Spec as __ extends Spec[K] ? never : K]: Spec[K];
}>;

export interface SpecAny<
  Id extends string = string,
  Params = any,
  Result = any,
  Lo extends __<Load> = any,
  State extends RunState = any,
> extends SpecCore<Params, Result, Lo, State> {
  Id: Id;
}

export type Spec$Params<S> = S extends { run: RunFn<infer X, any, any, any> } ? X : never;
export type Spec$Result<S> = S extends { run: RunFn<any, infer X, any, any> } ? X : never;
export type Spec$Deps<S> = S extends { load: any } ? Load$Deps<S["load"]> : never;
export type Spec$State<S> = S extends { state: any } ? ToRunState<S["state"]> : never;

export type Result$ERR<R> = Extract<Awaited<R>, Error>;
export type Result$OK<R> = Exclude<Awaited<R>, Error>;
export type Spec$ERR<S> = Result$ERR<Spec$Result<S>>;
export type Spec$OK<S> = Result$OK<Spec$Result<S>>;

const $spec =
  <Extra extends object>(extra = {} as Extra) =>
  <
    Lo extends Load,
    State extends RunStateOption<Load$Deps<NoInfer<Lo>>>,
    Update extends __ | UpdateFn<ToRunState<NoInfer<State>>, Load$Deps<NoInfer<Lo>>>,
  >(
    load = __ as Lo,
    state = {} as State,
    update = __ as Update,
  ) =>
  <Params, Result>(run: RunFn<Params, Result, NoInfer<Lo>, ToRunState<NoInfer<State>>>) =>
  <
    Options extends SpecOptions<NoInfer<Timeout>, Params, Result, Load$Deps<Lo>>,
    const Id extends string = "",
    const Timeout extends __<MsOrNumber> = __,
  >(
    Id = "" as Id,
    timeout = __ as Timeout,
    opt = {} as Options,
  ) =>
    ({
      ...extra,
      ...opt,
      Id,
      run,
      update,
      timeout,
      load,
      state,
    }) as Spec<Id, SpecCore<Params, Result, Lo, State, Update>, Options & { timeout: Timeout } & Extra>;

export const spec = $spec() as Fn$O<typeof $spec> & { $: typeof $spec; is: (e: object) => e is SpecCore };

spec.is = (e: object): e is SpecCore => "load" in e && "state" in e && "run" in e;
spec.$ = $spec;

export default spec;

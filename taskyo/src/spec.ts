import { __, Fn$O, Json, MsOrNumber } from "jsyoyo";

import { ERR, ErrorLikes } from "./errors";
import { Simplify } from "type-fest";
import { AwaiTreed, Dethunk, Tree } from "treeo";

export type Load =
  | __
  | (() => Promise<unknown>)
  | (Tree<Json | (() => Json) | (() => Promise<unknown>)> & { ERR?: () => Promise<ErrorLikes> });
export type Load$Deps<Lo extends Load> = __ extends Lo
  ? __
  : Lo extends () => Promise<infer X>
    ? X
    : AwaiTreed<Dethunk<Lo>>;

export type LoadedSpec<S extends SpecCore<any, any, any, any> = SpecCore> = S & {
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
  spec: LoadedSpec<SpecCore<Params, Result, Lo, State>>,
) => Result | readonly [Result, () => void];

export interface RunState {
  [k: PropertyKey]: unknown;
  curr?: number;
  total?: number;
}

type RunStateOption<Params, Deps> = RunState | ((params: Params, deps: Deps) => RunState);

type ToRunState<O extends RunStateOption<any, any>> = Fn$O<O, O> & RunState;
export type UpdateFn<State, Deps> = (state: State, deps: Deps) => void;

export interface SpecOptions<
  Timeout extends __<MsOrNumber> = __<MsOrNumber>,
  Params = unknown,
  Result = unknown,
  Deps = unknown,
> {
  Id?: string;
  avgTime?: MsOrNumber;
  retry?: RetryOptions<Result, Deps, Timeout extends 0 | __ ? never : InstanceType<ERR["timeout"]["$"]>>;
  cache?: {
    key: (p: Params) => string;
  };
}

export interface SpecCore<
  Params = unknown,
  Result = unknown,
  Lo extends Load = __,
  State extends RunStateOption<Params, Load$Deps<Lo>> = RunStateOption<Params, Load$Deps<Lo>>,
  Update extends __ | UpdateFn<ToRunState<State>, Load$Deps<Lo>> = __,
> {
  run: RunFn<Params, Result, Lo, ToRunState<State>>;
  state: State;
  load: Lo;
  update: Update;
}

export type Spec<Id extends string, Core, Options, Spec = { Id: Id } & Core & Options> = Simplify<{
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
export type Spec$Deps<S> = S extends SpecAny<string, any, any, infer X> ? X : never;
export type Spec$State<S> = S extends SpecAny<string, any, any, any, infer X> ? X : never;

export type Result$ERR<R> = Extract<Awaited<R>, Error>;
export type Result$OK<R> = Exclude<Awaited<R>, Error>;
export type Spec$ERR<S> = Result$ERR<Spec$Result<S>>;
export type Spec$OK<S> = Result$OK<Spec$Result<S>>;

const $spec =
  <Extra extends object>(extra = {} as Extra) =>
  <
    Params,
    Result,
    Lo extends Load,
    State extends RunStateOption<NoInfer<Params>, Load$Deps<NoInfer<Lo>>>,
    Update extends __ | UpdateFn<ToRunState<NoInfer<State>>, Load$Deps<NoInfer<Lo>>>,
  >(
    load: Lo,
    state: State,
    run: RunFn<Params, Result, NoInfer<Lo>, ToRunState<NoInfer<State>>>,
    update = __ as Update,
  ) =>
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

export default spec;

// const s = spec(
//   __,
//   { abc: 1 },
//   (p: "a" | "b") => (Math.random() > 0.5 ? ERR.critical(1, {} as never) : "ok"),
//   (state, deps) => state.abc++,
// )("", 2, {
//   retry: (t, d) => Promise.resolve(1),
// });

// const r = spec(
//   __,
//   (d, p) => ({ abc: 1 }),
//   (p: "a" | "b") => (Math.random() > 0.5 ? ERR.critical(1, {} as never) : "ok"),
//   () => 1,
// )();
// r.state;

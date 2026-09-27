import { __, MsOrNumber } from "jsyoyo";
import { Load, Load$Deps, RunFn, RunState } from "./types";
import { ERR } from "./errors";
import { Simplify } from "type-fest";

export type Result$ERR<R> = Extract<Awaited<R>, Error>;
export type Result$OK<R> = Exclude<Awaited<R>, Error>;

export type RetryOptions<Result, Deps, Err> = (err: Err | Result$ERR<Result>, deps: Deps) => Promise<unknown>;

export type Load$State<Lo extends Load, State extends RunState> = (deps: Load$Deps<Lo>) => State;
export type UpdateFn<State extends RunState, Deps> = __ | ((state: State, deps: Deps) => void);

export interface SpecOptions<
  Timeout,
  Params = unknown,
  Result = unknown,
  Deps = unknown,
  State extends RunState = RunState,
> {
  Id?: string;
  avgTime?: MsOrNumber;
  retry?: RetryOptions<Result, Deps, Timeout extends 0 | __ ? never : InstanceType<ERR["timeout"]["$"]>>;
  update?: UpdateFn<State, Deps>;
}

export interface SpecCore<
  Params = unknown,
  Result = unknown,
  Lo extends __<Load> = __,
  State extends RunState = RunState,
> {
  run: RunFn<Params, Result, Lo, State>;
  state: State | Load$State<Lo, State>;
  load?: Lo;
}

export type Spec<
  Id extends string,
  Core,
  Options,
  Timeout,
  Spec = { Id: Id } & Core & Options & { timeout: Timeout },
> = Simplify<{
  [K in keyof Spec as __ extends Spec[K] ? never : K]: Spec[K];
}>;

export const spec =
  <Params, Result, Lo extends Load, State extends RunState>(
    load: Lo,
    state: State | ((deps: Load$Deps<NoInfer<Lo>>, params: NoInfer<Params>) => State),
    run: RunFn<Params, Result, NoInfer<Lo>, NoInfer<State>>,
  ) =>
  <
    Options extends SpecOptions<NoInfer<Timeout>, Params, Result, Load$Deps<Lo>, State>,
    const Id extends string = "",
    const Timeout extends __<MsOrNumber> = __,
  >(
    Id = "" as Id,
    timeout = __ as Timeout,
    opt = {} as Options,
  ) =>
    ({
      Id,
      run,
      ...opt,
      timeout,
      load,
      state,
    }) as Spec<Id, SpecCore<Params, Result, Lo, State>, Options, Timeout>;

spec.is = (e: object): e is SpecCore => "load" in e && "state" in e && "run" in e;

export default spec;

const s = spec(__, {}, (p: "a" | "b") => (Math.random() > 0.5 ? ERR.critical(1, {} as never) : "ok"))("", __, {
  retry: (t, d) => Promise.resolve(1),
});

const r = spec(
  __,
  (d, p) => ({}),
  (p: "a" | "b") => (Math.random() > 0.5 ? ERR.critical(1, {} as never) : "ok"),
)();

s.retry;

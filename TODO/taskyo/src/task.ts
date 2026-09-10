import { $$, __, AbortSignal, CtxId, CtxId$Id, CtxIdConstraint, Dict, Fn$O, id, ON } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";
import { $progress, ProgressCreateOptions, ProgressUpdate, ProgressVar, ProgressInfo, ProgressSpec } from "./progress";
import "./utils";
import { fakeAbort } from "./utils";

// export type TaskSpecAny = TaskSpec<any, any, any, any, [any, any]>; - makes Typescript unhappy
export interface TaskSpecAny {
  Id: string;
  progress: any;
  load: () => any;
  loaded?: any;
  run: (p: any, d: any, a: any, u: any, s: any) => any;
}
export interface TaskSpec<
  ID extends string = string,
  Result = any,
  Params = any,
  Deps extends Tree | Promise<any> = any,
  Progress extends ProgressSpec = ProgressSpec<any, any>,
> {
  Id: ID;
  progress: Progress;
  load: () => Deps;
  loaded?: AwaiTreed<Deps>;
  run: (
    p: Params,
    d: AwaiTreed<Deps>,
    a: (on_abort: () => void) => void,
    u: ProgressUpdate<Progress[0], Fn$O<Progress[1]>>,
    s: TaskSpec<string, any, Params, Deps, Progress>,
  ) => Result;
}

export const spec =
  <
    const ProgressBase extends ProgressCreateOptions & Dict = {},
    ProgressMap extends (i: ProgressInfo<ProgressBase>) => ProgressInfo<ProgressBase> = (
      i: ProgressInfo<ProgressBase>,
    ) => ProgressInfo<ProgressBase>,
  >(
    progress = {} as ProgressBase,
    map = id as ProgressMap,
  ) =>
  <Deps extends Tree | Promise<any>>(load: () => Deps) =>
  <const Params, Result>(
    run: (
      p: Params,
      d: AwaiTreed<Deps>,
      a: (on_abort: () => void) => void,
      u: ProgressUpdate<ProgressBase, Fn$O<ProgressMap>>,
      s: TaskSpec<string, any, NoInfer<Params>, NoInfer<Deps>, any>,
    ) => Result,
  ) =>
  <Ctx extends $$<CtxIdConstraint>>(
    Ctx: Ctx,
  ): CtxId<Ctx, TaskSpec<CtxId$Id<Ctx>, Result, Params, Deps, ProgressSpec<ProgressBase, ProgressMap>>> =>
    CtxId(
      {
        progress: [progress, map],
        load,
        run,
      },
      Ctx,
    );

export type Spec$Result<S> = S extends { run: any } ? Awaited<ReturnType<S["run"]>> : never;
export type Spec$ResultOK<S> = Exclude<Spec$Result<S>, Error>;
export type Spec$Params<S> = S extends { run: any } ? Parameters<S["run"]>[0] : never;
export type Spec$Deps<S> = S extends { run: any } ? Parameters<S["run"]>[1] : never;

export const load = <S extends TaskSpecAny>(s: S) =>
  "loaded" in s
    ? Promise.resolve(s)
    : (awaiT(s.load()).then((l: any) => ((s.loaded = l), s)) as Promise<
        S extends { loaded: unknown } ? S : S & { loaded: Spec$Deps<S> }
      >);

export type TaskRun<S extends TaskSpec> = Promise<Awaited<Spec$Result<S>>> & {
  progress: ProgressVar<Fn$O<S["progress"][1]> extends ProgressCreateOptions ? Fn$O<S["progress"][1]> : never>["O"];
};

export const $run =
  <Spec extends TaskSpecAny>(spec: Spec) =>
  <Params extends Spec$Params<Spec>>(params: Params, abort = fakeAbort) => {
    const [p, update] = $progress(...spec.progress);

    const on = ON(abort);
    let d: () => void = () => __;
    const _abort = (f: () => void) => (d = on("abort", f));

    const $ = load(spec)
      .then((s) => s.run(params, s.loaded, _abort, update, s))
      .finally(d);
    return [$, p, update] as const;
  };

export const run =
  <Spec extends TaskSpecAny>(spec: Spec) =>
  <Params extends Spec$Params<Spec>>(params: Params, abort = fakeAbort) => {
    const [$, p] = $run(spec)(params, abort);
    ($ as any).progress = p.O;
    return $ as TaskRun<Spec>;
  };

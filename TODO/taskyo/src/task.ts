import { $$, __, CtxId, CtxId$Id, CtxIdConstraint, Dict, Fn$O, id, ON } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";
import { $progress, ProgressCreateOptions, ProgressUpdate, ProgressVar, ProgressInfo, ProgressSpec } from "./progress";
import "./utils";
import { fakeAbort } from "./utils";

// export type TaskAny = Task<any, any, any, any, [any, any]>; - makes Typescript unhappy
export interface TaskAny {
  Id: string;
  progress: any;
  load: () => any;
  loaded?: any;
  run: (p: any, d: any, a: any, u: any, s: any) => any;
}
export interface Task<
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
    s: Task<string, any, Params, Deps, Progress>,
  ) => Result;
}

export const task =
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
      s: Task<string, any, NoInfer<Params>, NoInfer<Deps>, any>,
    ) => Result,
  ) =>
  <Ctx extends $$<CtxIdConstraint>>(
    Ctx: Ctx,
  ): CtxId<Ctx, Task<CtxId$Id<Ctx>, Result, Params, Deps, ProgressSpec<ProgressBase, ProgressMap>>> =>
    CtxId(
      {
        progress: [progress, map],
        load,
        run,
      },
      Ctx,
    );

export type Task$Result<S> = S extends { run: any } ? Awaited<ReturnType<S["run"]>> : never;
export type Task$ResultOK<S> = Exclude<Task$Result<S>, Error>;
export type Task$Params<S> = S extends { run: any } ? Parameters<S["run"]>[0] : never;
export type Task$Deps<S> = S extends { run: any } ? Parameters<S["run"]>[1] : never;

export const load = <T extends TaskAny>(task: T) =>
  "loaded" in task
    ? Promise.resolve(task)
    : (awaiT(task.load()).then((l: any) => ((task.loaded = l), task)) as Promise<
        T extends { loaded: unknown } ? T : T & { loaded: Task$Deps<T> }
      >);

export type TaskRun<T extends Task> = Promise<Awaited<Task$Result<T>>> & {
  progress: ProgressVar<Fn$O<T["progress"][1]> extends ProgressCreateOptions ? Fn$O<T["progress"][1]> : never>["O"];
};

export const $run =
  <Task extends TaskAny>(task: Task) =>
  <Params extends Task$Params<Task>>(params: Params, abort = fakeAbort) => {
    const [p, update] = $progress(...task.progress);

    const on = ON(abort);
    let d: () => void = () => __;
    const _abort = (f: () => void) => (d = on("abort", f));

    const $ = load(task)
      .then((s) => s.run(params, s.loaded, _abort, update, s))
      .finally(d);
    return [$, p, update] as const;
  };

export const run =
  <Task extends TaskAny>(task: Task) =>
  <Params extends Task$Params<Task>>(params: Params, abort = fakeAbort) => {
    const [$, p] = $run(task)(params, abort);
    ($ as any).progress = p.O;
    return $ as TaskRun<Task>;
  };

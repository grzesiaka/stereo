import { __, a, CtxId, CtxId$Id, CtxIdRequired, id, ON } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";
import {
  $progress,
  ProgressCreateOptions,
  ProgressUpdate,
  ProgressVar,
  ProgressSpec,
  ProgressCalc,
  ProgressBase,
} from "./progress";
import { deferred, fakeAbort } from "./utils";
import { Simplify } from "type-fest";
import { AbortError, CRITIC } from "./errors";
import { disposyo } from "disposyo";

/**
 * Dependencies constraint
 */
export type DepsC = Tree | Promise<any> | __;

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
  Deps extends DepsC = any,
  Progress extends ProgressSpec = any,
> {
  Id: ID;
  progress: Progress;
  run: (
    p: Params,
    d: AwaiTreed<Deps>,
    a: (on_abort: () => void) => void,
    u: ProgressUpdate<Progress[0]>,
    s: Task<string, any, Params, Deps, Progress>,
  ) => Result;
  loaded?: AwaiTreed<Deps>;
  load: () => Deps;
}

export type Task$<E extends {}, T extends TaskAny> = Simplify<E & T>;

export const task =
  <ProgressShape extends ProgressCreateOptions = {}>(
    progress = {} as ProgressShape,
    map = id as ProgressCalc<ProgressShape>,
  ) =>
  <Deps extends DepsC, E extends {} = {}>(load: () => Deps, extra = {} as E) =>
  <const Params, Result>(
    run: (
      p: Params,
      d: AwaiTreed<Deps>,
      a: (on_abort: () => void) => void,
      u: ProgressUpdate<ProgressShape>,
      s: Task<string, any, NoInfer<Params>, NoInfer<Deps>, any>,
    ) => Result,
  ) =>
  <Ctx extends CtxIdRequired>(
    Ctx: Ctx,
  ): CtxId<Ctx, E & Task<CtxId$Id<Ctx>, Result, Params, Deps, ProgressSpec<ProgressShape & ProgressBase>>> =>
    CtxId(
      {
        ...extra,
        progress: [a({ total: Infinity, curr: 0 }, progress), map],
        load,
        run,
      },
      Ctx,
    );

export type Task$Result<S> = S extends { run: any } ? Awaited<ReturnType<S["run"]>> : never;
export type Task$ResultOK<S> = Exclude<Task$Result<S>, Error>;
export type Task$Error<S> = Extract<Task$Result<S>, Error>;
export type Task$Params<S> = S extends { run: any } ? Parameters<S["run"]>[0] : never;
export type Task$Deps<S> = S extends { run: any } ? Parameters<S["run"]>[1] : never;

export const load = <T extends TaskAny>(task: T) =>
  "loaded" in task
    ? Promise.resolve(task)
    : (awaiT(task.load()).then((l: any) => ((task.loaded = l), task)) as Promise<
        T extends { loaded: unknown } ? T : T & { loaded: Task$Deps<T> }
      >);

export type TaskRun<T extends Task> = Promise<Awaited<Task$Result<T>>> & {
  progress: ProgressVar<T["progress"][0] & ProgressBase>["O"];
};

export const $run =
  <Task extends TaskAny>(task: Task, [p, update] = $progress(...task.progress)) =>
  <Params extends Task$Params<Task>>(params: Params, abort = fakeAbort) => {
    const on = ON(abort);
    let _f: undefined | (() => void);
    const d = disposyo(on("abort", () => ((p.X.failed = new AbortError()), def.reject(p.X.failed), d(), _f?.())));
    const _abort = (f: () => void) => (_f = f);

    const def = deferred();
    const $ = Promise.race([
      load(task)
        .then((s) => s.run(params, s.loaded, _abort, update, s))
        .catch((e) => {
          const err = CRITIC(e, { task, progress: update() });
          update().failed = err;
          return Promise.reject(err);
        }),
      def.promise,
    ]).finally(d);

    return [$, p, update] as const;
  };

export const run =
  <Task extends TaskAny>(task: Task, progress = $progress(...task.progress)) =>
  <Params extends Task$Params<Task>>(params: Params, abort = fakeAbort) => {
    const [$, p] = $run(task, progress)(params, abort);
    ($ as any).progress = p.O;
    return $ as TaskRun<Task>;
  };

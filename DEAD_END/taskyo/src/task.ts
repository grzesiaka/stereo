import {
  __,
  a,
  CtxId,
  CtxId$Id,
  CtxIdRequired,
  id,
  ON,
  deferred,
  Json,
  OrPromise,
  timeout,
  MsOrNumber,
  wait,
} from "jsyoyo";
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
import { fakeAbort } from "./utils";
import { Simplify } from "type-fest";
import { AbortError, rrERROR, TimeoutError } from "./errors";
import { disposyo } from "disposyo";
import { CacheOption, CacheStore } from "./cache";

/**
 * Dependencies constraint
 */
export type DepsC = Tree | Promise<any> | __;

export interface TaskExtra<Params = any, Deps = any> {
  timeout?: MsOrNumber;
  loaded?: AwaiTreed<Deps>;
  cache?: {
    key: (params: Params, taskDeps: Deps, taskId: string) => OrPromise<string>;
    store?: CacheStore | CacheStore[];
  } & CacheOption;
}

// export type TaskAny = Task<any, any, any, any, [any, any]>; - makes Typescript unhappy
export interface TaskAny<Params = any, Result = any> extends TaskExtra {
  Id?: string;
  progress: any;
  load: () => any;
  run: (p: Params, d: any, a: any, u: any, s: any) => Result;
}
export interface Task<
  ID extends string = string,
  Result = any,
  Params = any,
  Deps extends DepsC = any,
  Progress extends ProgressSpec = any,
> extends TaskExtra {
  Id?: ID;
  progress: Progress;
  run: (
    p: Params,
    d: AwaiTreed<Deps>,
    a: (on_abort: () => void) => void,
    u: ProgressUpdate<Progress[0]>,
    s: Task<string, any, Params, Deps, Progress>,
  ) => Result;

  load: () => Deps;
}

export type Task$<E extends {}, T extends TaskAny> = Simplify<E & T>;

export const task =
  <ProgressShape extends ProgressCreateOptions = {}>(
    progress = {} as ProgressShape,
    map = id as ProgressCalc<ProgressShape>,
  ) =>
  <Deps extends DepsC = __, E = {}>(load = (() => __) as () => Deps, extra = {} as E) =>
  <const Params, Result>(
    run: (
      p: Params,
      d: AwaiTreed<Deps>,
      a: (on_abort: () => void) => void,
      u: ProgressUpdate<ProgressShape>,
      s: Task<string, any, NoInfer<Params>, NoInfer<Deps>, any>,
    ) => Result,
  ) =>
  <Ctx extends CtxIdRequired<TaskExtra<Params, Deps>>>(
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

task.$ = task()();
task.val = <X extends Json>(x: X) => task.$(() => x);

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
    const d = disposyo(on("abort", () => fail(new AbortError())));
    const _abort = (f: () => void) => (_f = f);

    const fail = (err: Error) => ((p.X.failed = err), def.reject(p.X.failed), d(), _f?.(), err);

    const def = deferred();

    const r = [
      load(task)
        .then((s) => {
          const r = s.run(params, s.loaded, _abort, update, s);
          return task.progress[0].total === Infinity
            ? r.then((x: never) => {
                const u = update();
                u.total === Infinity && timeout(0, () => update(1));
                return x;
              })
            : r;
        })
        .catch((e) => {
          const err = rrERROR(e, { task, progress: update() });
          update().failed = err;
          return Promise.reject(err);
        }),
      def.promise,
    ];

    if (task.timeout) {
      r.push(wait(task.timeout).then(() => fail(new TimeoutError(task, r[0] as never))));
    }

    const $ = Promise.race(r).finally(d);

    return [$, p, update] as const;
  };

export const run =
  <Task extends TaskAny>(task: Task, progress = $progress(...task.progress)) =>
  <Params extends Task$Params<Task>>(params: Params, abort = fakeAbort) => {
    const [$, p] = $run(task, progress)(params, abort);
    ($ as any).progress = p.O;
    return $ as TaskRun<Task>;
  };

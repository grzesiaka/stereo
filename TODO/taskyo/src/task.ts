import { __, AbortSignal, ON } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";
import { $progress, ProgressRunParams, ProgressSpec, ProgressUpdate, ProgressVar } from "./progress";
import "./_utils";
import { disposyo } from "disposyo";

export interface TaskSpec<
  ID extends string = string,
  Result = any,
  Params = any,
  Deps extends Tree | Promise<any> = any,
  Progress extends ProgressSpec = ProgressSpec,
> {
  ID: ID & (string & {});
  progress: Progress;
  load: () => Deps;
  loaded?: AwaiTreed<Deps>;
  run: (
    p: Params,
    d: AwaiTreed<Deps>,
    a: (onborted: () => void) => void,
    u: ProgressUpdate<Progress>,
    s: TaskSpec<ID, any, Params, Deps, Progress>,
  ) => Result;
}

export const spec =
  <ID extends string, const Progress extends ProgressSpec = ["", 1]>(ID: ID, ...progress: Progress) =>
  <Deps extends Tree | Promise<any>>(load: () => Deps) =>
  <const Params, Result>(
    run: (
      p: Params,
      d: AwaiTreed<Deps>,
      a: (onborted: () => void) => void,
      u: ProgressUpdate<Progress>,
      s: TaskSpec<ID, any, NoInfer<Params>, NoInfer<Deps>, Progress>,
    ) => Result,
  ): TaskSpec<ID, Result, Params, Deps, Progress> => ({
    ID,
    progress,
    load,
    run,
  });

export type Spec$Result<S> = S extends { run: any } ? ReturnType<S["run"]> : never;
export type Spec$Params<S> = S extends { run: any } ? Parameters<S["run"]>[0] : never;
export type Spec$Deps<S> = S extends { run: any } ? Parameters<S["run"]>[1] : never;

export const load = <S extends TaskSpec<any, any, any, any, any>>(s: S) =>
  "loaded" in s
    ? Promise.resolve(s)
    : (awaiT(s.load()).then((l: any) => ((s.loaded = l), s)) as Promise<
        S extends { loaded: unknown } ? S : S & { loaded: Spec$Deps<S> }
      >);

export type TaskRun<S extends TaskSpec> = Promise<Awaited<Spec$Result<S>>> & {
  progress: ProgressVar<S["progress"]>["O"];
};
export const run =
  <Spec extends TaskSpec<string, any, any, any, any>>(spec: Spec) =>
  <Params extends Spec$Params<Spec>, ProgressTotal extends ProgressRunParams<Spec["progress"]>>(
    params: Params,
    abort: AbortSignal,
    ...total: ProgressTotal
  ) => {
    const progress = $progress(spec, ...total);
    const P = progress().X;
    const on = ON(abort);
    const d = disposyo([
      on("abc", () => 1),
      on("abort", () => {
        progress().X.aborted = true;
        progress(P.value as any);
      }),
    ]);

    const abo = (f: () => void) => d.__.push(on("abort", f));
    const $ = load(spec)
      .then((s) => s.run(params, s.loaded, abo, progress as any, s))
      .finally(d) as TaskRun<Spec>;
    $.progress = progress().O;
    return $;
  };

//type TaskDuration<Avg extends number = number, Max extends __<number> = __<number>> = __ extends Max ? Avg : [Avg, Max];
// export interface WithTime<Time extends __<TaskDuration> = __<TaskDuration>> {
//   time: Time;
// }

// export interface Task<S extends TaskSpec> {
//   spec: S;
// }

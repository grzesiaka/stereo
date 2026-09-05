import { __, id } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";
import { initProgress, ProgressRunParams, ProgressSpec, ProgressUpdate, ProgressVar } from "./progress";
import "./_utils";
import { AbortSignal, NEVER } from "./_utils";

export interface TaskSpec<
  ID extends string = string,
  Result = unknown,
  Params = unknown,
  Deps extends Tree | Promise<unknown> = Tree | Promise<unknown>,
  Progress extends ProgressSpec = ProgressSpec,
> {
  ID: ID;
  progress: Progress;
  load: () => Deps;
  loaded?: Deps;
  run: (
    p: Params,
    d: AwaiTreed<Deps>,
    a: (onborted: () => void) => void,
    u: ProgressUpdate<ID, Progress>,
    s: TaskSpec<ID, NoInfer<Result>, Params, NoInfer<Deps>, Progress>,
  ) => Result;
}

export const spec =
  <ID extends string, const Progress extends ProgressSpec = ["", 1]>(ID: ID, ...progress: Progress) =>
  <Deps extends Tree | Promise<unknown>>(load: () => Deps) =>
  <Params, Result>(
    run: (
      p: Params,
      d: AwaiTreed<Deps>,
      a: (onborted: () => void) => void,
      u: ProgressUpdate<ID, Progress>,
      s: TaskSpec<ID, NoInfer<Result>, Params, NoInfer<Deps>, Progress>,
    ) => Result,
  ): TaskSpec<ID, Result, Params, Deps, Progress> => ({
    ID,
    progress,
    load,
    run,
  });

type Spec$Result<S> = S extends TaskSpec<any, infer X> ? X : never;
type Spec$Params<S> = S extends TaskSpec<any, any, infer X> ? X : never;
type Spec$Deps<S> = S extends TaskSpec<any, any, any, infer X> ? X : never;

export const load = <S extends TaskSpec>(s: S) =>
  "loaded" in s
    ? Promise.resolve(s)
    : (awaiT(s.load()).then((l) => ((s.loaded = l), s)) as Promise<
        S extends { loaded: unknown } ? S : S & { loaded: Spec$Deps<S> }
      >);

export type TaskRun<S extends TaskSpec> = Promise<Awaited<Spec$Result<S>>> & {
  progress: ProgressVar<S["ID"], S["progress"]>["O"];
};
export const run =
  <Spec extends TaskSpec>(spec: Spec) =>
  <Params extends Spec$Params<Spec>, ProgressTotal extends ProgressRunParams<Spec["progress"]>>(
    params: Params,
    abort: AbortSignal,
    ...total: ProgressTotal
  ) => {
    const progress = initProgress(spec, ...total);
    const P = progress().X;
    let dispose = id;
    const abo = (f: () => void) => {
      abort.addEventListener("abort", () => {
        progress().X.aborted = true;
        progress(P.value);
      });
      dispose = (x) => (abort.removeEventListener("abort", f), P.aborted ? (NEVER as never) : x);
    };
    const $ = load(spec)
      .then((s) => s.run(params, s.loaded, abo, progress, s))
      .then(dispose) as TaskRun<Spec>;
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

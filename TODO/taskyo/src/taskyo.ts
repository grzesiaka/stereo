import { Var } from "ioioy";
import { $$, __ } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";

type ProgressSpec<Units extends string = string, Max extends __<number> = __<number>> = [units: Units, max: Max];
type ProgressRunParams<S extends ProgressSpec> = __ extends S[1] ? (S[1] extends __ ? [] : [$$<S[1]>]) : [];
type ProgressVar<ID extends string, S extends ProgressSpec> = Var<
  ID,
  {
    unit: S[0];
    total: S[1];
    value: S[1];
    _01: number; // TODO clamped
  }
>;

type ProgressUpdate<ID extends string, S extends ProgressSpec> = (() => ProgressVar<ID, S>) &
  (never extends $$<S[1]> ? {} : (v: $$<S[1]>) => ProgressVar<ID, S>["X"]);

const initProgress = <Spec extends TaskSpec>(
  spec: Spec,
  ...init: ProgressRunParams<Spec["progress"]>
): ProgressUpdate<Spec["ID"], Spec["progress"]> => {
  const p = spec.progress;
  const x = Var({
    unit: p[0],
    total: init[0] || p[1],
    value: 0,
    get _01() {
      return x.X.total === __ ? __ : Math.trunc((1000 * x.X.value) / x.X.total) * 1000;
    },
  });
  return ((v?: $$<Spec["progress"][1]>) => {
    if (!v) return x.X;
    x.X.value = Math.min(v, x.X.total || 0);
    x.I(x.X);
    return x.X;
  }) as never;
};

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
    ...total: ProgressTotal
  ) => {
    const progress = initProgress(spec, ...total);
    const $ = load(spec).then((s) => s.run(params, s.loaded, () => 1, progress, s)) as TaskRun<Spec>;
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

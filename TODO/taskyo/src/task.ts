import { __, AbortSignal, ON } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";
import { $progress, ProgressRunParams, ProgressCreateOptions, ProgressUpdate, ProgressVar } from "./progress";
import "./utils";
import { disposyo } from "disposyo";

export type TaskSpacAny = TaskSpec<any, any, any, any, any>;
export interface TaskSpec<
  ID extends string = string,
  Result = any,
  Params = any,
  Deps extends Tree | Promise<any> = any,
  Progress extends ProgressCreateOptions = ProgressCreateOptions,
> {
  ID: ID;
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
  <const Progress extends ProgressCreateOptions = {}, Extra extends {} = {}>(
    progress = {} as Progress,
    extra = {} as Extra,
  ) =>
  <ID extends string, Deps extends Tree | Promise<any>>(ID: ID, load: () => Deps) =>
  <const Params, Result>(
    run: (
      p: Params,
      d: AwaiTreed<Deps>,
      a: (onborted: () => void) => void,
      u: ProgressUpdate<Progress>,
      s: TaskSpec<ID, any, NoInfer<Params>, NoInfer<Deps>, Progress>,
    ) => Result,
  ): TaskSpec<ID, Result, Params, Deps, Progress> & Extra => ({
    ...extra,
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
export const $run =
  <Spec extends TaskSpec<string, any, any, any, any>>(spec: Spec) =>
  <Params extends Spec$Params<Spec>, ProgressTotal extends ProgressRunParams<Spec["progress"]>>(
    params: Params,
    abort: AbortSignal,
    ...total: ProgressTotal
  ) => {
    const [p, update] = $progress(spec.progress)(...(total as never));

    const on = ON(abort);
    const d = disposyo([on("abort", () => update(p.X.curr, "abort"))]);
    const _abort = (f: () => void) => d.__.push(on("abort", f));

    const $ = load(spec)
      .then((s) => s.run(params, s.loaded, _abort, update, s))
      .finally(d) as TaskRun<Spec>;
    $.progress = p.O;
    return [$, p] as const;
  };

export const run =
  <Spec extends TaskSpec<string, any, any, any, any>>(spec: Spec) =>
  <Params extends Spec$Params<Spec>, ProgressTotal extends ProgressRunParams<Spec["progress"]>>(
    params: Params,
    abort: AbortSignal,
    ...total: ProgressTotal
  ) =>
    $run(spec)(params, abort, ...total)[0];

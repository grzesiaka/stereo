import { __, AbortSignal, Fn$O, id, ON } from "jsyoyo";
import { awaiT, AwaiTreed, Tree } from "treeo";
import {
  $progress,
  ProgressRunParams,
  ProgressCreateOptions,
  ProgressUpdate,
  ProgressVar,
  ProgressInfo,
  ProgressSpec,
} from "./progress";
import "./utils";

export type TaskSpecAny = TaskSpec<any, any, any, any, any>;
export interface TaskSpec<
  ID extends string = string,
  Result = any,
  Params = any,
  Deps extends Tree | Promise<any> = any,
  Progress extends ProgressSpec = ProgressSpec,
> {
  ID: ID;
  progress: Progress;
  load: () => Deps;
  loaded?: AwaiTreed<Deps>;
  run: (
    p: Params,
    d: AwaiTreed<Deps>,
    a: (on_abort: () => void) => void,
    u: ProgressUpdate<Progress[0]>,
    s: TaskSpec<ID, any, Params, Deps, Progress>,
  ) => Result;
}

export const spec =
  <
    const ProgressBase extends ProgressCreateOptions = {},
    ProgressMap extends (i: ProgressInfo<ProgressBase>) => ProgressInfo<ProgressBase> = (
      i: ProgressInfo<ProgressBase>,
    ) => ProgressInfo<ProgressBase>,
    Extra extends {} = {},
  >(
    progress = {} as ProgressBase,
    map = id as ProgressMap,
    extra = {} as Extra,
  ) =>
  <ID extends string, Deps extends Tree | Promise<any>>(ID: ID, load: () => Deps) =>
  <const Params, Result>(
    run: (
      p: Params,
      d: AwaiTreed<Deps>,
      a: (on_abort: () => void) => void,
      u: ProgressUpdate<Fn$O<ProgressMap>>,
      s: TaskSpec<ID, any, NoInfer<Params>, NoInfer<Deps>, any>,
    ) => Result,
  ): TaskSpec<ID, Result, Params, Deps, ProgressSpec<ProgressBase, ProgressMap>> & Extra => // @ts-expect-error
  ({
    ...extra,
    ID,
    progress: [progress, map],
    load,
    run,
  });

export type Spec$Result<S> = S extends { run: any } ? Awaited<ReturnType<S["run"]>> : never;
export type Spec$ResultOK<S> = Exclude<Spec$Result<S>, Error>;
export type Spec$Params<S> = S extends { run: any } ? Parameters<S["run"]>[0] : never;
export type Spec$Deps<S> = S extends { run: any } ? Parameters<S["run"]>[1] : never;

export const load = <S extends TaskSpec<any, any, any, any, any>>(s: S) =>
  "loaded" in s
    ? Promise.resolve(s)
    : (awaiT(s.load()).then((l: any) => ((s.loaded = l), s)) as Promise<
        S extends { loaded: unknown } ? S : S & { loaded: Spec$Deps<S> }
      >);

export type TaskRun<S extends TaskSpec> = Promise<Awaited<Spec$Result<S>>> & {
  progress: ProgressVar<Fn$O<S["progress"][1]> extends ProgressCreateOptions ? Fn$O<S["progress"][1]> : never>["O"];
};

export const $run =
  <Spec extends TaskSpec<string, any, any, any, any>>(spec: Spec) =>
  <Params extends Spec$Params<Spec>, ProgressTotal extends ProgressRunParams<Spec["progress"][0]>>(
    params: Params,
    abort: AbortSignal,
    ...total: ProgressTotal
  ) => {
    const [p, update] = $progress(...spec.progress)(...(total as never));

    const on = ON(abort);
    let d: () => void = () => __;
    const _abort = (f: () => void) => (d = on("abort", f));

    const $ = load(spec)
      .then((s) => s.run(params, s.loaded, _abort, update, s))
      .finally(d);
    return [$, p, update] as const;
  };

export const run =
  <Spec extends TaskSpec<string, any, any, any, any>>(spec: Spec) =>
  <Params extends Spec$Params<Spec>, ProgressTotal extends ProgressRunParams<Spec["progress"][0]>>(
    params: Params,
    abort: AbortSignal,
    ...total: ProgressTotal
  ) => {
    const [$, p] = $run(spec)(params, abort, ...total);
    ($ as any).progress = p.O;
    return $ as TaskRun<Spec>;
  };

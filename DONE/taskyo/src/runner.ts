import { AbortController, CtxIdOptional } from "jsyoyo";
import { Run, run, Spec$Run } from "./run";
import { LoadedSpec, Spec$ERR, Spec$OK, Spec$Params } from "./spec";
import { $IO, IO } from "ioioy";
import { ERR } from "./errors";

export type RunnerUpdates<X, S extends LoadedSpec> =
  | ["+", Run<S>, X]
  | ["-", Spec$OK<S> | Spec$ERR<S> | ERR["abort"], Run<S>, X];

export interface RunnerState {
  runs: Set<Run>;
}
export interface Runner<
  S extends LoadedSpec = LoadedSpec,
  Ctx extends CtxIdOptional = {},
  X extends RunnerState = RunnerState,
  OnNext extends Spec$Run<S> | null = Spec$Run<S> | null,
> extends IO<Spec$Params<S>, RunnerUpdates<X, S>, X, Ctx, OnNext> {
  spec: S;
  abort: AbortController;
}

export const runner =
  <X extends RunnerState>(
    onNext: (run: () => Run | null, runner: Runner<LoadedSpec, CtxIdOptional>) => Run | null,
    onRunDone?: (run: Run, runner: Runner<LoadedSpec, CtxIdOptional>) => void,
    onDispose = (runner: Runner<LoadedSpec, CtxIdOptional>) => runner.abort.abort(),
    state = (() => ({ runs: new Set() })) as () => X,
  ) =>
  <S extends LoadedSpec, L = {}>(spec: S, L = {} as L) =>
    $IO(state, { spec, abort: new AbortController(), ...L })<Spec$Params<S>, RunnerUpdates<X, S>>((O, X, $) => [
      (x) => {
        const r = onNext(() => {
          if ($.abort.signal.aborted) return null;
          return run($.spec as never)(x as never, $.abort.signal);
        }, $ as never);
        if (r && !$.abort.signal.aborted) {
          r.promise.then(
            (v) =>
              !$.abort.signal.aborted &&
              (onRunDone?.(r, $ as never), X().runs.delete(r), O(["-", v as never, r as never, X()])),
          );
          X().runs.add(r);
          O(["+", r as never, X()]);
        }
        return r;
      },
      () => onDispose($ as never),
    ]) as <Ctx extends CtxIdOptional>(ctx?: Ctx) => Runner<S, Ctx, X> & L;

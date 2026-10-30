import { AbortController, CtxIdOptional } from "jsyoyo";
import { Run, run, Spec$Run } from "./run";
import { Spec, Spec$ERR, Spec$OK, Spec$Params } from "./spec";
import { $IO, IO } from "ioioy";

export type RunnerUpdates<X, S extends Spec> = ["+", Run<S>, X] | ["-", Spec$OK<S> | Spec$ERR<S>, Run<S>, X];

export interface RunnerState {
  runs: Set<Run>;
}
export interface Runner<
  S extends Spec = Spec,
  Ctx extends CtxIdOptional = {},
  X extends RunnerState = RunnerState,
  OnNext extends Promise<Spec$Run<S>> | Spec$Run<S> | null = Promise<Spec$Run<S>> | Spec$Run<S> | null,
> extends IO<Spec$Params<S>, RunnerUpdates<X, S>, X, Ctx, OnNext> {
  spec: S;
  abort: AbortController;
}

export const runner =
  <X extends RunnerState>(
    onNext: (run: () => Promise<Run> | Run | null, runner: Runner<Spec, CtxIdOptional>) => Promise<Run> | Run | null,
    onRunDone?: (run: Run, runner: Runner<Spec, CtxIdOptional>) => void,
    onDispose = (runner: Runner<Spec, CtxIdOptional>) => runner.abort.abort(),
    state = (() => ({ runs: new Set() })) as () => X,
  ) =>
  <S extends Spec, L = {}>(spec: S, L = {} as L) =>
    $IO(state, { spec, abort: new AbortController(), ...L })<Spec$Params<S>, RunnerUpdates<X, S>>((O, X, $) => [
      async (x) => {
        const r = await onNext(() => {
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

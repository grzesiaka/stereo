import { AbortController, CtxIdOptional } from "jsyoyo";
import { Run, run } from "./run";
import { Spec$Params, SpecAny, Spec } from "./spec";
import { $IO, IO, IO_State } from "ioioy";

export type RunnerUpdates<X, S extends SpecAny> = ["+" | "-", Run<S>, X];

export interface Runner<X, Spec extends SpecAny, Ctx extends CtxIdOptional> extends IO<
  Spec$Params<Spec>,
  X,
  RunnerUpdates<X, Spec>,
  Ctx
> {
  spec: Spec;
  abort: AbortController;
}

export const runner =
  <X extends { runs: Run[] }>(
    onNext: (run: Run, X: IO_State<X>) => void,
    onRunDone: (run: Run, X: IO_State<X>) => void,
    onDispose = (abort: AbortController, _X: IO_State<X>) => abort.abort(),
    state = (() => ({ runs: [] as Run[] })) as () => X,
  ) =>
  <S extends SpecAny, L = {}>(spec: S, L = {} as L) => {
    const abort = new AbortController();
    $IO(state, { spec, abort, ...L })<Spec$Params<S>, RunnerUpdates<X, S>>((O, X) => [
      async (x) => {
        const r = (await run(spec as Spec)(x, abort.signal)) as Run<S>;
        if (!abort.signal.aborted) {
          r.promise.then(() => !abort.signal.aborted && (onRunDone(r, X), O(["-", r, X()])));
          onNext(r, X);
          O(["+", r, X()]);
        }
      },
      () => onDispose(abort, X),
    ]) as <Ctx extends CtxIdOptional>(ctx?: Ctx) => Runner<X, S, Ctx> & L;
  };

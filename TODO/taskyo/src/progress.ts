import { Var } from "ioioy";
import { $$, __, Fn$I } from "jsyoyo";

interface Base<Value extends number = number, Total extends Value = Value> {
  curr: Value;
  total: Total;
}

export interface ProgressCreateOptions<Value extends number = number, Total extends Value = Value> extends Partial<
  Base<Value, Total>
> {}

type Failed = "abort" | "error";
interface ProgressInfo<S extends ProgressCreateOptions> extends Base<$$<S["curr"]> & number, $$<S["total"]> & number> {
  failed?: Failed;
}
export type ProgressVar<S extends ProgressCreateOptions> = Var<string, ProgressInfo<S>>;

export type ProgressUpdate<S extends ProgressCreateOptions> = (() => ProgressInfo<S>) &
  ((next: $$<S["curr"]> & number, failed?: Failed) => ProgressInfo<S>);

export type ProgressRunParams<O extends ProgressCreateOptions> = __ extends O["total"]
  ? [$$<O["total"]> & number]
  : [O["total"]?];

export const $progress =
  <const O extends ProgressCreateOptions = {}>(options = {} as O) =>
  <T extends ProgressRunParams<O>>(...total: T): [ProgressVar<O>, ProgressUpdate<O>] => {
    const i = { curr: 0, total: total[0], ...options } as never as ProgressInfo<O>;
    const x = Var(i) as ProgressVar<O>;
    return [
      x,
      // Interestingly: Parameters<F> seems to not pick-up []
      ((...vf: Fn$I<ProgressUpdate<O>> | []) => {
        if (vf.length === 0) return x.X;
        const i = {
          ...x.X,
          curr: Math.min(vf[0] || 0, x.X.total),
        } as ProgressInfo<O>;
        vf[1] && (i.failed = vf[1]);
        x.I(i);
        return x.X;
      }) as ProgressUpdate<O>,
    ];
  };

export const _01 = (curr: number, total: number) => Math.trunc((curr / total) * 100) / 100;

import { Var } from "ioioy";
import { $$, __, Fn$I, Fn$O, id } from "jsyoyo";
import { Simplify } from "type-fest";

interface Base<Value extends number = number, Total extends Value = Value> {
  curr: Value;
  total: Total;
}

export interface ProgressCreateOptions<Value extends number = number, Total extends Value = Value> extends Partial<
  Base<Value, Total>
> {}

export type ProgressMap<O extends ProgressCreateOptions = ProgressCreateOptions> = (
  i: ProgressInfo<O>,
) => ProgressInfo<O>;

type Failed = "abort" | "error";
export type ProgressInfo<S extends ProgressCreateOptions> = Simplify<
  Omit<S, "total" | "curr"> &
    S & {
      total: $$<S["total"]> & number;
      curr: $$<S["curr"]> & number;
      failed?: Failed;
    }
>;
export type ProgressVar<S extends ProgressCreateOptions> = Var<string, ProgressInfo<S>>;

export type ProgressUpdate<S extends ProgressCreateOptions> = (() => ProgressInfo<S>) &
  ((next: $$<S["curr"]> & number, failed?: Failed) => ProgressInfo<S>);

export type ProgressRunParams<O extends ProgressCreateOptions> = __ extends O["total"]
  ? [$$<O["total"]> & number]
  : [O["total"]?];

// INFO the proper type should accept <O extends ProgressCreateOptions = {}, M extends ProgressMap<O> = ProgressMap<O>>
//      unfortunately Typescript is unhappy then; anyway this is just a simple pair
export type ProgressSpec<O extends ProgressCreateOptions = {}, M = unknown> = [O, M];

export const $progress =
  <const O extends ProgressCreateOptions = {}, Map extends ProgressMap<O> = ProgressMap<O>>(
    options = {} as O,
    map = id as Map,
  ) =>
  <T extends ProgressRunParams<O>>(...total: T): [ProgressVar<Fn$O<Map>>, ProgressUpdate<Fn$O<Map>>] => {
    const i = { curr: 0, total: total[0], ...options } as never as ProgressInfo<O>;
    const x = Var(map(i)) as ProgressVar<O>;
    return [
      x,
      // Interestingly: Parameters<F> seems to not pick-up []
      ((...vf: Fn$I<ProgressUpdate<O>> | []) => {
        if (vf.length === 0) return x.X;
        const i = map({
          ...x.X,
          curr: Math.min(vf[0] || 0, x.X.total),
        }) as ProgressInfo<O>;
        vf[1] && ((i as any).failed = vf[1]);
        x.I(i);
        return x.X;
      }) as ProgressUpdate<O>,
    ] as never;
  };

export const _01 = (curr: number, total: number) => Math.trunc((curr / total) * 100) / 100;

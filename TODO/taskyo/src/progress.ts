import { Var } from "ioioy";
import { $$, __, Fn$I, id } from "jsyoyo";
import { Simplify, Writable } from "type-fest";

export interface ProgressBase {
  [k: string]: unknown;
  curr: number;
  total: number;
  prev?: number;
  /** worst case duration */
  // dur?: number;
}

export interface ProgressCreateOptions extends Partial<ProgressBase> {}

export type ProgressCalc<O extends ProgressCreateOptions = ProgressCreateOptions> = (
  i: Writable<ProgressInfo<O>>,
) => void;

export type ProgressInfo<S extends ProgressCreateOptions = ProgressCreateOptions> = Simplify<
  Omit<S, "total" | "curr"> &
    S & {
      total: $$<S["total"]> & number;
      curr: $$<S["curr"]> & number;
    }
>;
export type ProgressVar<S extends ProgressCreateOptions> = Var<string, ProgressInfo<S>>;

export type ProgressUpdate<S extends ProgressCreateOptions> = (() => ProgressInfo<S>) &
  ((next: $$<S["curr"]> & number, other?: Partial<Omit<S, "curr">>) => ProgressInfo<S>);

// INFO the proper type should accept <O extends ProgressCreateOptions = {}, M extends ProgressMap<O> = ProgressMap<O>>
//      unfortunately Typescript is unhappy then; anyway this is just a simple pair
export type ProgressSpec<O extends ProgressCreateOptions = {}> = [ProgressInfo<O>, ProgressCalc<any>?];

export const $progress = <const O extends ProgressCreateOptions = {}>(
  options = {} as O,
  calc = id as ProgressCalc<O>,
): [ProgressVar<ProgressInfo<O>>, ProgressUpdate<ProgressInfo<O>>] => {
  const i = { curr: 0, total: Infinity, ...options } as ProgressInfo<O>;
  calc(i as never); // might be not writable
  const x = Var(i) as ProgressVar<ProgressInfo<O>>; // should be ProgressVar<Fn$O<Map>> but Typescript rather unhappy
  return [
    x,
    // Interestingly: Parameters<F> seems to not pick-up []
    ((...vf: Fn$I<ProgressUpdate<ProgressInfo<O>>> | []) => {
      if (vf.length === 0) return x.X;
      const i = {
        ...x.X,
        ...vf[1],
        curr: Math.min(vf[0] || 0, x.X.total),
      } as ProgressInfo<O>;
      calc(i as never);
      x.I(i);
      return x.X;
    }) as ProgressUpdate<ProgressInfo<O>>,
  ];
};

export const _01 = (curr: number, total: number) => Math.trunc((curr / total) * 100) / 100;

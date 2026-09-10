import { Var } from "ioioy";
import { $$, __, Fn$I, Fn$O, id } from "jsyoyo";
import { Simplify } from "type-fest";

export interface ProgressBase<Value extends number = number, Total extends Value = Value> {
  curr: Value;
  total: Total;
}

export interface ProgressCreateOptions<Value extends number = number, Total extends Value = Value> extends Partial<
  ProgressBase<Value, Total>
> {}

export type ProgressMap<O extends ProgressCreateOptions = ProgressCreateOptions> = (
  i: ProgressInfo<O>,
) => ProgressInfo<O>;

export type ProgressInfo<S extends ProgressCreateOptions = ProgressCreateOptions> = Simplify<
  Omit<S, "total" | "curr"> &
    S & {
      total: $$<S["total"]> & number;
      curr: $$<S["curr"]> & number;
    }
>;
export type ProgressVar<S extends ProgressCreateOptions> = Var<string, ProgressInfo<S>>;

export type ProgressUpdate<S extends ProgressCreateOptions, M extends ProgressCreateOptions> = (() => ProgressInfo<M>) &
  ((next: $$<S["curr"]> & number, other?: Partial<Omit<S, "curr">>) => ProgressInfo<S>);

// INFO the proper type should accept <O extends ProgressCreateOptions = {}, M extends ProgressMap<O> = ProgressMap<O>>
//      unfortunately Typescript is unhappy then; anyway this is just a simple pair
export type ProgressSpec<
  O extends ProgressCreateOptions = {},
  M extends (a: any) => ProgressInfo<O> = (a: any) => ProgressInfo<O>,
> = [O, M];

export const $progress = <const O extends ProgressCreateOptions = {}, Map extends ProgressMap<O> = ProgressMap<O>>(
  options = {} as O,
  map = id as Map,
): [ProgressVar<Fn$O<Map>>, ProgressUpdate<O, Fn$O<Map>>] => {
  const i = { curr: 0, total: Infinity, ...options } as never as ProgressInfo<O>;
  const x = Var(map(i)) as ProgressVar<O>; // should be ProgressVar<Fn$O<Map>> but Typescript rather unhappy
  return [
    x as never as ProgressVar<Fn$O<Map>>,
    // Interestingly: Parameters<F> seems to not pick-up []
    ((...vf: Fn$I<ProgressUpdate<O, Fn$O<Map>>> | []) => {
      if (vf.length === 0) return x.X;
      const i = map({
        ...x.X,
        ...vf[1],
        curr: Math.min(vf[0] || 0, x.X.total),
      }) as ProgressInfo<O>;
      x.I(i);
      return x.X;
    }) as ProgressUpdate<O, Fn$O<Map>>,
  ];
};

export const _01 = (curr: number, total: number) => Math.trunc((curr / total) * 100) / 100;

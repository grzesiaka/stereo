import { $$, __, ARR, FLIP, Fn, OP } from "./0";

export const o =
  <X, L>(x: X, L: L): ComposeAsync<X, L> =>
  (...fns: ARR<Fn>) => {
    if (fns.length === 0) return [x, L] as any;
    const f = async (i: any) => {
      let r = [i];
      for (let f of $.__[0][2]) {
        const n = await f(r[r.length - 1], $.__[0][0], r);
        if (n instanceof Error) return [n, r];
        r.push(n);
      }
      return r[r.length - 1] as any;
    };
    const $ = OP("o")([L, x, fns])(x === void 0 ? f : (...[x]: any[]): any => f(x === void 0 ? $.__[0][1] : x));
    return $;
  };

o.$ = <const L = {}>(L = {} as L) => ((x?: unknown) => o(x, L)) as any as $ComposeAsync<L>;

export default o;

type A<X> = Exclude<Awaited<X>, Error>;
type AA<X> = X extends [infer H, ...infer R] ? [A<H>, ...AA<R>] : [];

type RR<X, ACC extends ARR = []> = X extends [infer H, ...infer R]
  ? R extends []
    ? H
    : (Extract<H, Error> extends never ? never : [Extract<H, Error>, ACC]) | oResult<R, [...ACC, A<Exclude<H, Error>>]>
  : never;
export type oResult<X, ACC extends ARR = []> = Promise<RR<X, ACC>>;

export type $ComposeAsync<L> = (<X>() => ComposeAsync<__ extends X ? X : __<X>, L>) &
  (<const X>(x: X) => ComposeAsync<X, L>);

export type ComposeAsync<X, L> = (() => [X, L]) &
  (<const R>(f0: (x: $$<X>, L: L) => R) => (...x: FLIP<X>) => oResult<[$$<X>, R]>) &
  (<const R, const X0>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => R,
  ) => (...x: FLIP<X>) => oResult<[$$<X>, X0, R]>) &
  (<const R, const X0, const X1>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => R,
  ) => (...x: FLIP<X>) => oResult<[$$<X>, X0, X1, R]>) &
  (<const R, const X0, const X1, const X2>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => R,
  ) => (...x: FLIP<X>) => oResult<[$$<X>, X0, X1, X2, R]>) &
  (<const R, const X0, const X1, const X2, const X3>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => R,
  ) => (...x: FLIP<X>) => oResult<[$$<X>, X0, X1, X2, X3, R]>) &
  (<const R, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => X4,
    f5: (x: A<X4>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4]>) => R,
  ) => (...x: FLIP<X>) => oResult<[$$<X>, X0, X1, X2, X3, X4, R]>) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => X4,
    f5: (x: A<X4>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4]>) => X5,
    f6: (x: A<X5>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4, X5]>) => R,
  ) => (...x: FLIP<X>) => oResult<[$$<X>, X0, X1, X2, X3, X4, X5, R]>) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => X4,
    f5: (x: A<X4>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4]>) => X5,
    f6: (x: A<X5>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4, X5]>) => X6,
    f7: (x: A<X6>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4, X5, X6]>) => R,
  ) => (...x: FLIP<X>) => oResult<[$$<X>, X0, X1, X2, X3, X4, X5, X6, R]>);

const A = async () => {
  return 1;
};

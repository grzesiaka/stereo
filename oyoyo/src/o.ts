import { $$, __, ARR, FLIP, Fn, OP } from "./0";

export const o =
  <L, X>(L: L, x: X): ComposeAsync<X, L> =>
  (...fns: ARR<Fn>) => {
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

o.$ = <const L = {}>(L = {} as L) => ((x?: unknown) => o(L, x)) as any as $ComposeAsync<L>;

export default o;

type A<X> = Awaited<X>;
type AA<X> = X extends [infer H, ...infer R] ? [Awaited<H>, ...AA<R>] : [];

export type $ComposeAsync<L> = (<X>() => ComposeAsync<X, L>) & (<const X>(x: X) => ComposeAsync<X, L>);

export type ComposeAsync<X, L> = (() => (...x: FLIP<X>) => Promise<$$<X>>) &
  (<const R>(f0: (x: $$<X>, L: L) => R) => (...x: FLIP<X>) => R) &
  (<const R, const X0>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R, const X0, const X1>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R, const X0, const X1, const X2>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => X4,
    f5: (x: A<X4>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4]>) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => X4,
    f5: (x: A<X4>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4]>) => X5,
    f6: (x: A<X5>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4, X5]>) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: A<X0>, L: L, R: AA<[$$<X>, X0]>) => X1,
    f2: (x: A<X1>, L: L, R: AA<[$$<X>, X0, X1]>) => X2,
    f3: (x: A<X2>, L: L, R: AA<[$$<X>, X0, X1, X]>) => X3,
    f4: (x: A<X3>, L: L, R: AA<[$$<X>, X0, X1, X2, X3]>) => X4,
    f5: (x: A<X4>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4]>) => X5,
    f6: (x: A<X5>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4, X5]>) => X6,
    f7: (x: A<X6>, L: L, R: AA<[$$<X>, X0, X1, X2, X3, X4, X5, X6]>) => R,
  ) => (...x: FLIP<X>) => R);

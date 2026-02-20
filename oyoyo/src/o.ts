import { $$, __, ARR, Fn, OP } from "./0";

export const o =
  <X, L>(L: L, x: X): Compose<X, L> =>
  (...fns: ARR<Fn>) => {
    if (!fns.length) return L as any;
    const $ = OP("o")([L, x, fns])((i: any) => {
      let r = i === void 0 ? [$.__[0][1]] : [i];
      for (let f of $.__[0][2]) {
        r.push(f(r[r.length - 1], $.__[0][0], r));
      }
      return r[r.length - 1] as any;
    });
    return $;
  };

o.$ = <const L = {}>(L = {} as L) => ((x?: never) => o(L, x)) as $Compose<L>;

export default o;

type Flipped<X> = __ extends X ? [$$<X>] : [__<X>?];

export type $Compose<L> = (<X = __>() => Compose<X, L>) & (<const X>(x: X) => Compose<X, L>);

export type Compose<X, L> = (() => L) &
  (<const R>(f0: (x: $$<X>, L: L) => R) => (...x: Flipped<X>) => R) &
  (<const R, const X0>(f0: (x: $$<X>, L: L) => X0, f1: (x: X0, L: L, R: [X, X0]) => R) => (...x: Flipped<X>) => R) &
  (<const R, const X0, const X1>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [X, X0]) => X1,
    f2: (x: X1, L: L, R: [X, X0, X1]) => R,
  ) => (...x: Flipped<X>) => R) &
  (<const R, const X0, const X1, const X2>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [X, X0]) => X1,
    f2: (x: X1, L: L, R: [X, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [X, X0, X1, X]) => R,
  ) => (...x: Flipped<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [X, X0]) => X1,
    f2: (x: X1, L: L, R: [X, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [X, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [X, X0, X1, X2, X3]) => R,
  ) => (...x: Flipped<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [X, X0]) => X1,
    f2: (x: X1, L: L, R: [X, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [X, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [X, X0, X1, X2, X3]) => X4,
    f5: (x: X4, L: L, R: [X, X0, X1, X2, X3, X4]) => R,
  ) => (...x: Flipped<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [X, X0]) => X1,
    f2: (x: X1, L: L, R: [X, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [X, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [X, X0, X1, X2, X3]) => X4,
    f5: (x: X4, L: L, R: [X, X0, X1, X2, X3, X4]) => X5,
    f6: (x: X5, L: L, R: [X, X0, X1, X2, X3, X4, X5]) => R,
  ) => (...x: Flipped<X>) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [X, X0]) => X1,
    f2: (x: X1, L: L, R: [X, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [X, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [X, X0, X1, X2, X3]) => X4,
    f5: (x: X4, L: L, R: [X, X0, X1, X2, X3, X4]) => X5,
    f6: (x: X5, L: L, R: [X, X0, X1, X2, X3, X4, X5]) => X6,
    f7: (x: X6, L: L, R: [X, X0, X1, X2, X3, X4, X5, X6]) => R,
  ) => (...x: Flipped<X>) => R);

import { $$, __, ARR, FLIP, Fn, OP } from "./0";

export const c =
  <X, L = __, R = unknown>(x: X, L = __ as L, _?: R): Compose<X, L> =>
  (...fns: ARR<Fn>) => {
    if (!fns.length) return [x, L] as any;
    const f = (i: any) => {
      let r = [i];
      for (let f of $.__[0][2]) {
        r.push(f(r[r.length - 1], $.__[0][0], r));
      }
      return r[r.length - 1] as any;
    };
    const $ = OP("c")([L, x, fns])(x === void 0 ? f : (...[x]: any[]): any => f(x === void 0 ? $.__[0][1] : x));
    return $;
  };

c.$$ = (() =>
  (L = __) =>
  (x?) =>
    c(x, L)) as $$Compose;
c.$ = c.$$();

export default c;

type $$Compose = <R>() => <const L = __>(L?: L) => (<X>() => Compose<X, L, R>) & (<const X>(x: X) => Compose<X, L, R>);

export type Compose<X, L, cR = unknown> = (() => [X, L]) &
  (<const R extends cR>(f0: (x: $$<X>, L: L) => R) => (...x: FLIP<X>) => R) &
  (<const R extends cR, const X0>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [$$<X>, X0]) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R extends cR, const X0, const X1>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [$$<X>, X0]) => X1,
    f2: (x: X1, L: L, R: [$$<X>, X0, X1]) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R extends cR, const X0, const X1, const X2>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [$$<X>, X0]) => X1,
    f2: (x: X1, L: L, R: [$$<X>, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [$$<X>, X0, X1, X]) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R extends cR, const X0, const X1, const X2, const X3>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [$$<X>, X0]) => X1,
    f2: (x: X1, L: L, R: [$$<X>, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [$$<X>, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [$$<X>, X0, X1, X2, X3]) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R extends cR, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [$$<X>, X0]) => X1,
    f2: (x: X1, L: L, R: [$$<X>, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [$$<X>, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [$$<X>, X0, X1, X2, X3]) => X4,
    f5: (x: X4, L: L, R: [$$<X>, X0, X1, X2, X3, X4]) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R extends cR, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [$$<X>, X0]) => X1,
    f2: (x: X1, L: L, R: [$$<X>, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [$$<X>, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [$$<X>, X0, X1, X2, X3]) => X4,
    f5: (x: X4, L: L, R: [$$<X>, X0, X1, X2, X3, X4]) => X5,
    f6: (x: X5, L: L, R: [$$<X>, X0, X1, X2, X3, X4, X5]) => R,
  ) => (...x: FLIP<X>) => R) &
  (<const R extends cR, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: X0, L: L, R: [$$<X>, X0]) => X1,
    f2: (x: X1, L: L, R: [$$<X>, X0, X1]) => X2,
    f3: (x: X2, L: L, R: [$$<X>, X0, X1, X]) => X3,
    f4: (x: X3, L: L, R: [$$<X>, X0, X1, X2, X3]) => X4,
    f5: (x: X4, L: L, R: [$$<X>, X0, X1, X2, X3, X4]) => X5,
    f6: (x: X5, L: L, R: [$$<X>, X0, X1, X2, X3, X4, X5]) => X6,
    f7: (x: X6, L: L, R: [$$<X>, X0, X1, X2, X3, X4, X5, X6]) => R,
  ) => (...x: FLIP<X>) => R);

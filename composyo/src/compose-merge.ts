import { $$, __, ARR, FLIP, Fn } from "jsyoyo";
import { OP } from "xpresyo";
import { Simplify } from "type-fest";

/** Compose and merge
 * [!] It mutates the argument provided by `Object.assign`ing intermediary object-like values.
 * It accumulates steps performed in an array.
 * Strings and other primitives are not merged. Strings could be used to label steps if needed.
 */
export const composeMerge =
  <X extends object, L = __, R = unknown>(x: X, L = __ as L, _?: R): ComposeMerge<X, L> =>
  (...fns: ARR<Fn>) => {
    if (!fns.length) return x as any;
    const f = (i: any) => {
      let r = [];
      let m = i;
      for (let f of $.__[1][2]) {
        const current = f(m, $.__[1][0], r);
        r.push(current);
        typeof current !== "string" && Object.assign(m, current);
      }
      return m as any;
    };
    const $ = OP("m")([L, x, fns])(x === void 0 ? f : (...[x]: any[]): any => f(x === void 0 ? $.__[1][1] : x));
    return $;
  };

composeMerge.$$ = (() =>
  (L = __) =>
  (x?) =>
    composeMerge(x || {}, L)) as $$ComposeMerge;
composeMerge.$ = composeMerge.$$();

export default composeMerge;

type $$ComposeMerge = <R>() => <const L = __>(
  L?: L,
) => (<X extends object = {}>() => ComposeMerge<X | undefined, L, R>) &
  (<const X extends object>(x: X) => ComposeMerge<X, L, R>);

/** MergeObjectLike - ignore non-objects (compatible with Object.assign) */
type _M<A> = A extends readonly [infer H, ...infer R] ? M<R> & (H extends object ? H : {}) : {};
type M<A> = Simplify<_M<A>>;

export type ComposeMerge<X extends __<object>, L = undefined, cR = unknown> = (() => X) &
  (<const R extends cR>(f0: (x: $$<X>, L: L) => R) => (...x: FLIP<X>) => M<[$$<X>, R]>) &
  (<const R extends cR, const X0>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: M<[$$<X>, X0]>, L: L, R: [X0]) => R,
  ) => (...x: FLIP<X>) => M<[$$<X>, X0, R]>) &
  (<const R extends cR, const X0, const X1>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: M<[$$<X>, X0]>, L: L, R: [X0]) => X1,
    f2: (x: M<[$$<X>, X0, X1]>, L: L, R: [X0, X1]) => R,
  ) => (...x: FLIP<X>) => M<[$$<X>, X0, X1, R]>) &
  (<const R extends cR, const X0, const X1, const X2>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: M<[$$<X>, X0]>, L: L, R: [X0]) => X1,
    f2: (x: M<[$$<X>, X0, X1]>, L: L, R: [X0, X1]) => X2,
    f3: (x: M<[$$<X>, X0, X1, X2]>, L: L, R: [X0, X1, X]) => R,
  ) => (...x: FLIP<X>) => M<[$$<X>, X0, X1, X2, R]>) &
  (<const R extends cR, const X0, const X1, const X2, const X3>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: M<[$$<X>, X0]>, L: L, R: [X0]) => X1,
    f2: (x: M<[$$<X>, X0, X1]>, L: L, R: [X0, X1]) => X2,
    f3: (x: M<[$$<X>, X0, X1, X2]>, L: L, R: [X0, X1, X]) => X3,
    f4: (x: M<[$$<X>, X0, X1, X2, X3]>, L: L, R: [X0, X1, X2, X3]) => R,
  ) => (...x: FLIP<X>) => M<[$$<X>, X0, X1, X2, X3, R]>) &
  (<const R extends cR, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: M<[$$<X>, X0]>, L: L, R: [X0]) => X1,
    f2: (x: M<[$$<X>, X0, X1]>, L: L, R: [X0, X1]) => X2,
    f3: (x: M<[$$<X>, X0, X1, X2]>, L: L, R: [X0, X1, X]) => X3,
    f4: (x: M<[$$<X>, X0, X1, X2, X3]>, L: L, R: [X0, X1, X2, X3]) => X4,
    f5: (x: M<[$$<X>, X0, X1, X2, X3, X4]>, L: L, R: [X0, X1, X2, X3, X4]) => R,
  ) => (...x: FLIP<X>) => M<[$$<X>, X0, X1, X2, X3, X4, R]>) &
  (<const R extends cR, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: M<[$$<X>, X0]>, L: L, R: [X0]) => X1,
    f2: (x: M<[$$<X>, X0, X1]>, L: L, R: [X0, X1]) => X2,
    f3: (x: M<[$$<X>, X0, X1, X2]>, L: L, R: [X0, X1, X]) => X3,
    f4: (x: M<[$$<X>, X0, X1, X2, X3]>, L: L, R: [X0, X1, X2, X3]) => X4,
    f5: (x: M<[$$<X>, X0, X1, X2, X3, X4]>, L: L, R: [X0, X1, X2, X3, X4]) => X5,
    f6: (x: M<[$$<X>, X0, X1, X2, X3, X4, X5]>, L: L, R: [X0, X1, X2, X3, X4, X5]) => R,
  ) => (...x: FLIP<X>) => M<[$$<X>, X0, X1, X2, X3, X4, X5, R]>) &
  (<const R extends cR, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: $$<X>, L: L) => X0,
    f1: (x: M<[$$<X>, X0]>, L: L, R: [X0]) => X1,
    f2: (x: M<[$$<X>, X0, X1]>, L: L, R: [X0, X1]) => X2,
    f3: (x: M<[$$<X>, X0, X1, X2]>, L: L, R: [X0, X1, X]) => X3,
    f4: (x: M<[$$<X>, X0, X1, X2, X3]>, L: L, R: [X0, X1, X2, X3]) => X4,
    f5: (x: M<[$$<X>, X0, X1, X2, X3, X4]>, L: L, R: [X0, X1, X2, X3, X4]) => X5,
    f6: (x: M<[$$<X>, X0, X1, X2, X3, X4, X5]>, L: L, R: [X0, X1, X2, X3, X4, X5]) => X6,
    f7: (x: M<[$$<X>, X0, X1, X2, X3, X4, X5, X6]>, L: L, R: [X0, X1, X2, X3, X4, X5, X6]) => R,
  ) => (...x: FLIP<X>) => M<[$$<X>, X0, X1, X2, X3, X4, X5, X6, R]>);

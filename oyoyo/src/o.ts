import { __, ARR, Fn, OP } from "./0";



const $o = <const L extends ARR>(...L: L) => <const I extends [] | [any], X = I[0]>(...i: I) => (i.length ? [...L, i[0] as X] : [...L]) as I['length'] extends 0 ? L : [...L, X]

const y = $o(1,2)<[], 'X'>()
const x = $o(...y)('y')

export const o =
  <X>(): Compose<X> =>
  (...fns: ARR<Fn>) => {
    const $ = OP("o")(fns)((x: any) => {
      let r = [x];
      for (let f of $.__[0]) {
        r.push(f(r[r.length - 1], r));
      }
      return r as any;
    });
    return $;
  };

export default o;

export type Compose<X, L extends ARR = []> = (() => (x: X) => X) &
  (<const R>(f0: (x: X, L: ) => R) => (x: X) => R) &
  (<const R, const X0>(f0: (x: X) => X0, f1: (x: X0, p: [X, X0]) => R) => (x: X) => R) &
  (<const R, const X0, const X1>(
    f0: (x: X) => X0,
    f1: (x: X0, p: [X, X0]) => X1,
    f2: (x: X1, p: [X, X0, X1]) => R,
  ) => (x: X) => R) &
  (<const R, const X0, const X1, const X2>(
    f0: (x: X) => X0,
    f1: (x: X0, p: [X, X0]) => X1,
    f2: (x: X1, p: [X, X0, X1]) => X2,
    f3: (x: X2, p: [X, X0, X1, X]) => R,
  ) => (x: X) => R) &
  (<const R, const X0, const X1, const X2, const X3>(
    f0: (x: X) => X0,
    f1: (x: X0, p: [X, X0]) => X1,
    f2: (x: X1, p: [X, X0, X1]) => X2,
    f3: (x: X2, p: [X, X0, X1, X]) => X3,
    f4: (x: X3, p: [X, X0, X1, X2, X3]) => R,
  ) => (x: X) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: X) => X0,
    f1: (x: X0, p: [X, X0]) => X1,
    f2: (x: X1, p: [X, X0, X1]) => X2,
    f3: (x: X2, p: [X, X0, X1, X]) => X3,
    f4: (x: X3, p: [X, X0, X1, X2, X3]) => X4,
    f5: (x: X4, p: [X, X0, X1, X2, X3, X4]) => R,
  ) => (x: X) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: X) => X0,
    f1: (x: X0, p: [X, X0]) => X1,
    f2: (x: X1, p: [X, X0, X1]) => X2,
    f3: (x: X2, p: [X, X0, X1, X]) => X3,
    f4: (x: X3, p: [X, X0, X1, X2, X3]) => X4,
    f5: (x: X4, p: [X, X0, X1, X2, X3, X4]) => X5,
    f6: (x: X5, p: [X, X0, X1, X2, X3, X4, X5]) => R,
  ) => (x: X) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: X) => X0,
    f1: (x: X0, p: [X, X0]) => X1,
    f2: (x: X1, p: [X, X0, X1]) => X2,
    f3: (x: X2, p: [X, X0, X1, X]) => X3,
    f4: (x: X3, p: [X, X0, X1, X2, X3]) => X4,
    f5: (x: X4, p: [X, X0, X1, X2, X3, X4]) => X5,
    f6: (x: X5, p: [X, X0, X1, X2, X3, X4, X5]) => X6,
    f7: (x: X6, p: [X, X0, X1, X2, X3, X4, X5, X6]) => R,
  ) => (x: X) => R);

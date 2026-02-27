import { ARR } from "./0";

/**
 * A sequence of transformation applied to a starting value
 *
 * @param x a starting value (sets the type of the first transformation)
 * @returns final result obtained by applying all the transformation
 */
export const p =
  <X, L extends ARR = []>(x: X, ...L: L): Pipe<X, L> =>
  <Fs extends ReadonlyArray<Function>>(...fs: Fs) => {
    if (!fs.length) {
      return L.length ? [x, ...L] : (x as any);
    }
    let r = x;
    for (const c of fs) {
      r = c(r, ...L);
    }
    return r;
  };

export default p;

export type Pipe<X, L extends ARR = []> = (() => [] extends L ? X : [X, ...L]) &
  (<const R>(f0: (x: X, ...L: L) => R) => R) &
  (<const R, const X0>(f0: (x: X, ...L: L) => X0, f1: (x: X0, ...L: L) => R) => R) &
  (<const R, const X0, const X1>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6, const X7>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6, const X7, const X8>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => X8,
    f9: (x: X8, ...L: L) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6, const X7, const X8, const X9>(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => X8,
    f9: (x: X8, ...L: L) => X9,
    f10: (x: X9, ...L: L) => R,
  ) => R) &
  (<
    const R,
    const X0,
    const X1,
    const X2,
    const X3,
    const X4,
    const X5,
    const X6,
    const X7,
    const X8,
    const X9,
    const X10,
  >(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => X8,
    f9: (x: X8, ...L: L) => X9,
    f10: (x: X9, ...L: L) => X10,
    f11: (x: X10, ...L: L) => R,
  ) => R) &
  (<
    const R,
    const X0,
    const X1,
    const X2,
    const X3,
    const X4,
    const X5,
    const X6,
    const X7,
    const X8,
    const X9,
    const X10,
    const X11,
  >(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => X8,
    f9: (x: X8, ...L: L) => X9,
    f10: (x: X9, ...L: L) => X10,
    f11: (x: X10, ...L: L) => X11,
    f12: (x: X11, ...L: L) => R,
  ) => R) &
  (<
    const R,
    const X0,
    const X1,
    const X2,
    const X3,
    const X4,
    const X5,
    const X6,
    const X7,
    const X8,
    const X9,
    const X10,
    const X11,
    const X12,
  >(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => X8,
    f9: (x: X8, ...L: L) => X9,
    f10: (x: X9, ...L: L) => X10,
    f11: (x: X10, ...L: L) => X11,
    f12: (x: X11, ...L: L) => X12,
    f13: (x: X12, ...L: L) => R,
  ) => R) &
  (<
    const R,
    const X0,
    const X1,
    const X2,
    const X3,
    const X4,
    const X5,
    const X6,
    const X7,
    const X8,
    const X9,
    const X10,
    const X11,
    const X12,
    const X13,
  >(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => X8,
    f9: (x: X8, ...L: L) => X9,
    f10: (x: X9, ...L: L) => X10,
    f11: (x: X10, ...L: L) => X11,
    f12: (x: X11, ...L: L) => X12,
    f13: (x: X12, ...L: L) => X13,
    f14: (x: X13, ...L: L) => R,
  ) => R) &
  (<
    const R,
    const X0,
    const X1,
    const X2,
    const X3,
    const X4,
    const X5,
    const X6,
    const X7,
    const X8,
    const X9,
    const X10,
    const X11,
    const X12,
    const X13,
    const X14,
  >(
    f0: (x: X, ...L: L) => X0,
    f1: (x: X0, ...L: L) => X1,
    f2: (x: X1, ...L: L) => X2,
    f3: (x: X2, ...L: L) => X3,
    f4: (x: X3, ...L: L) => X4,
    f5: (x: X4, ...L: L) => X5,
    f6: (x: X5, ...L: L) => X6,
    f7: (x: X6, ...L: L) => X7,
    f8: (x: X7, ...L: L) => X8,
    f9: (x: X8, ...L: L) => X9,
    f10: (x: X9, ...L: L) => X10,
    f11: (x: X10, ...L: L) => X11,
    f12: (x: X11, ...L: L) => X12,
    f13: (x: X12, ...L: L) => X13,
    f14: (x: X13, ...L: L) => X14,
    f15: (x: X14, ...L: L) => R,
  ) => R);

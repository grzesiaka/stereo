/**
 * A sequence of transformation applied to a starting value
 *
 * @param x a starting value (sets the type of the first transformation)
 * @returns final result obtained by applying all the transformation
 */
export const p =
  <X>(x: X): Pipe<X> =>
  // @ts-expect-error !OK!
  <Fs extends ReadonlyArray<Function>>(...fs: Fs) => {
    let r = x;
    for (const c of fs) {
      r = c(r);
    }
    return r;
  };

export default p;

export type Pipe<X> = (() => X) &
  (<const R>(f0: (x: X) => R) => R) &
  (<const R, const X0>(f0: (x: X) => X0, f1: (x: X0) => R) => R) &
  (<const R, const X0, const X1>(f0: (x: X) => X0, f1: (x: X0) => X1, f2: (x: X1) => R) => R) &
  (<const R, const X0, const X1, const X2>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6, const X7>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6, const X7, const X8>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => X8,
    f9: (x: X8) => R,
  ) => R) &
  (<const R, const X0, const X1, const X2, const X3, const X4, const X5, const X6, const X7, const X8, const X9>(
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => X8,
    f9: (x: X8) => X9,
    f10: (x: X9) => R,
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
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => X8,
    f9: (x: X8) => X9,
    f10: (x: X9) => X10,
    f11: (x: X10) => R,
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
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => X8,
    f9: (x: X8) => X9,
    f10: (x: X9) => X10,
    f11: (x: X10) => X11,
    f12: (x: X11) => R,
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
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => X8,
    f9: (x: X8) => X9,
    f10: (x: X9) => X10,
    f11: (x: X10) => X11,
    f12: (x: X11) => X12,
    f13: (x: X12) => R,
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
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => X8,
    f9: (x: X8) => X9,
    f10: (x: X9) => X10,
    f11: (x: X10) => X11,
    f12: (x: X11) => X12,
    f13: (x: X12) => X13,
    f14: (x: X13) => R,
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
    f0: (x: X) => X0,
    f1: (x: X0) => X1,
    f2: (x: X1) => X2,
    f3: (x: X2) => X3,
    f4: (x: X3) => X4,
    f5: (x: X4) => X5,
    f6: (x: X5) => X6,
    f7: (x: X6) => X7,
    f8: (x: X7) => X8,
    f9: (x: X8) => X9,
    f10: (x: X9) => X10,
    f11: (x: X10) => X11,
    f12: (x: X11) => X12,
    f13: (x: X12) => X13,
    f14: (x: X13) => X14,
    f15: (x: X14) => R,
  ) => R);

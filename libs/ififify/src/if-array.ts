import { ARR } from "~types";

/**
 * If array
 * @param x object to test
 * @param a array path
 * @param n no-array path
 * @returns result of array path or no-array path depending on `x`
 */
export const ifArray = <X, A, O>(x: X, a: (a: Extract<X, ARR>) => A, n: (n: Exclude<X, ARR>) => O) =>
  Array.isArray(x) ? a(x as Extract<X, ARR>) : n(x as Exclude<X, ARR>);

export default ifArray;

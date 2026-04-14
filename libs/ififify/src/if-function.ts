import { Fn } from "~types";

/**
 * If function
 * @param x object to test
 * @param a function path
 * @param n non-function path
 * @returns result of function path or non-function path depending on `x`
 */
export const ifFunction = <X, A, O>(x: X, f: (a: Extract<X, Fn>) => A, n: (n: Exclude<X, Fn>) => O) =>
  typeof f === "function" ? f(x as Extract<X, Fn>) : n(x as Exclude<X, Fn>);

export default ifFunction;

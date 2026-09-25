/**
 * If string
 * @param x object to test
 * @param f string path
 * @param n non-string path
 * @returns result of string path or non-string path depending on `x`
 */
export const ifString = <X, A, O = Exclude<X, string>>(
  x: X,
  f: (a: Extract<X, string>) => A,
  n = ((x: X) => x) as any as (n: Exclude<X, string>) => O,
) => (typeof x === "string" ? f(x as Extract<X, string>) : n(x as Exclude<X, string>));

export default ifString;

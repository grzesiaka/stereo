export type Dethunk<X> = X extends readonly [infer H, ...infer R]
  ? [Dethunk<H>, ...Dethunk<R>]
  : X extends () => infer R
    ? R // could be Dethunk<R> if fully recursive, but probably should be a separate function if needed
    : X;

/**
 * Recursively executes thunks. Replacing thunk with the result of the execution. Non-thunks are left intact.
 * @param x array | thunk | anything-actually
 * @returns the same shape, content updated / applied
 */
export const dethunk = <const X>(x: X): Dethunk<X> => {
  if (Array.isArray(x)) {
    return x.map(dethunk) as Dethunk<X>;
  } else if (typeof x === "function" && !x.length) {
    return x() as Dethunk<X>;
  }
  return x as Dethunk<X>;
};

export default dethunk;

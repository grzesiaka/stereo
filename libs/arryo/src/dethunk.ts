export type Dethunk<X> = X extends readonly [infer H, ...infer R]
  ? [Dethunk<H>, ...Dethunk<R>]
  : X extends () => infer R
    ? R // Dethunk<R> if recursive, but probably should be a separate function if needed
    : X;

export const dethunk = <const X>(x: X): Dethunk<X> => {
  if (Array.isArray(x)) {
    return x.map(dethunk) as Dethunk<X>;
  } else if (typeof x === "function" && !x.length) {
    return x() as Dethunk<X>;
  }
  return x as Dethunk<X>;
};

export default dethunk;

export type Dethunk<X> = X extends () => infer R ? R : X;
/**
 * If value is a thunk it is run; otherwise identity
 * @param x anything
 * @returns `x` or `x()`
 */
export const dethunk = <X>(x: X) => (typeof x === "function" && !x.length ? x() : x) as Dethunk<X>;

dethunk.$ = <X, R>(x: X, $: (x: Dethunk<X>) => R) => $(dethunk(x));

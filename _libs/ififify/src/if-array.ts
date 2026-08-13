import { ARR } from "~types";

/**
 * If array
 * @param x object to test
 * @param arrayPath array path
 * @param nonArrayPath non-array path
 * @returns result of array path or non-array path depending on `x`
 */
export const ifArray = <X, A, O = Exclude<X, ARR>>(
  x: X,
  arrayPath: (a: Extract<X, ARR>) => A,
  nonArrayPath = ((x: any) => x) as any as (n: Exclude<X, ARR>) => O,
) => (Array.isArray(x) ? arrayPath(x as Extract<X, ARR>) : nonArrayPath(x as Exclude<X, ARR>));

ifArray.$ =
  <X, A, O = Exclude<X, ARR>>(
    arrayPath: (a: Extract<X, ARR>) => A,
    nonArrayPath = ((x: any) => x) as any as (n: Exclude<X, ARR>) => O,
  ) =>
  (x: X) =>
    Array.isArray(x) ? arrayPath(x as Extract<X, ARR>) : nonArrayPath(x as Exclude<X, ARR>);

export default ifArray;

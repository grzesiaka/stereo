/**
 * If error
 * @param x value to test
 * @param errorPath error path
 * @param nonErrorPath non-error path
 * @returns result of error path or non-error path depending on `x`
 */
export const ifError = <X, A, O = Exclude<X, Error>>(
  x: X,
  errorPath: (a: Extract<X, Error>) => A,
  nonErrorPath = ((x: any) => x) as any as (n: Exclude<X, Error>) => O,
) => (x instanceof Error ? errorPath(x as Extract<X, Error>) : nonErrorPath(x as Exclude<X, Error>));

ifError.$ =
  <X, A, O = Exclude<X, Error>>(
    errorPath: (a: Extract<X, Error>) => A,
    nonErrorPath = ((x: any) => x) as any as (n: Exclude<X, Error>) => O,
  ) =>
  (x: X) =>
    x instanceof Error ? errorPath(x as Extract<X, Error>) : nonErrorPath(x as Exclude<X, Error>);

export default ifError;

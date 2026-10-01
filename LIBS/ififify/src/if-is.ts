export type Is<F = any, X extends F = any> = (f: F) => f is X;
export type Is$Out<P> = P extends Is<any, infer X> ? X : never;
export type Is$In<P> = P extends Is<infer Y> ? Y : never;

export const ifIs =
  <P extends Is>(p: P) =>
  <A>(isPath: (value: Is$Out<P>) => A) =>
  <X extends Is$In<P>, B = Exclude<Is$Out<P>, X>>(
    value: X,
    nonIsPath = ((x: never) => x) as any as (other: Exclude<Is$Out<P>, X>) => B,
  ) =>
    p(value) ? isPath(value as never) : nonIsPath(value as never);

export default ifIs;

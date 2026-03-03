import o, { Compose } from "../o";
import { __, Fn, Fn1, id, Fn$O, Fn$I, $$, a } from "../0";
import { yR, yR2X, yR_Base } from "./0";
import c, { ComposeAsync } from "../c";

const FL: FilterMapLOp = yR(
  "F",
  id,
)(($, P, _, L) =>
  a($, {
    p: P((x) => {
      const v = $.__[1]!(L)(x);
      v !== __ && $.x(v);
    }),
  }),
);

/**
 * Applies a function to a stream value
 *
 * `undefined` (aka `__`) values returned by the function are filtered out
 *
 * @param f a function to apply to each value in a stream
 * @returns a function from previous *yR* P to FilterMap<X, P>
 */
export const F = ((f?: Fn) => FL(() => f || id)) as any as FilterMapOp & {
  /**
   * `(fn: Fn1) => F(fn)`
   */
  ify: FilterMapify;
  L: FilterMapLOp;
  seL: FilterMapOpByName;
  o: FilterMapComposeOp;
  c: FilterMapComposeAsyncOp;
};

/**
 * `(fn: Fn1) => F(fn)`
 */
F.ify = ((f: Fn1) => F(f)) as FilterMapify;
F.L = FL;
F.seL = ((f: string) => FL((L) => (L as any)[f])) as FilterMapOpByName;
F.o = ((f) => FL((L) => f(o(__ as any), L as any))) as FilterMapComposeOp;
F.c = ((f) => FL((L) => f(c(__ as any), L as any))) as FilterMapComposeAsyncOp;

export interface _FilterMap<X, P extends yR> extends yR_Base<X, P> {}
export type FilterMap<X, P extends yR> = yR<$$<X>, _FilterMap<X, P>>;

export type FilterMapOpByName = <P extends yR, L, K extends keyof L>(
  k: K,
) => (P: P, L: L) => L[K] extends Fn<yR2X<P>> ? FilterMap<Fn$O<L[K]>, P> : __;
export type FilterMapOp = <P extends yR, const X = yR2X<P>>(f?: Fn<[yR2X<P>], X>) => (P: P) => FilterMap<X, P>;
export type FilterMapLOp = <P extends yR, L extends {}, const X = yR2X<P>>(
  f: (L: L) => Fn<[yR2X<P>], X>,
) => (P: P, L: L) => FilterMap<X, P>;

export type FilterMapComposeOp = <P extends yR, L, const X = yR2X<P>>(
  f: Fn<[Compose<yR2X<P>>, L], Fn<[yR2X<P>], X>>,
) => (P: P, L: L) => FilterMap<X, P>;

export type FilterMapComposeAsyncOp = <P extends yR, L, const X = yR2X<P>>(
  f: Fn<[ComposeAsync<yR2X<P>>, L], Fn<[yR2X<P>], X>>,
) => (P: P, L: L) => FilterMap<X, P>;

export type FilterMapify = <F extends Fn1>(F: F) => <P extends yR<Fn$I<F>[0]>>(P: P) => FilterMap<Fn$O<F>, P>;

export default F;

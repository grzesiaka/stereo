import { Simplify, UnknownRecord } from "type-fest";
import { __, a, Fn, Fn$I, Fn$O, Fn1, u } from "./0";
import p from "./p";

/**
 * Callback
 */
type Cb<X> = (x: X) => void;

/**
 * Continuation
 */
type Ko<X = unknown, R = unknown> = (x: Cb<X>) => R;

/**
 * Done / Dispose / Clean-up
 *
 * `undefined` - nothing to dispose / no long-running computations
 *
 * Function should be once-callable
 */
type Done = __ | (() => void);

/**
 *  Reactive Cell / Observee / yR-unit
 */
type iR<
  X = unknown,
  L extends UnknownRecord = UnknownRecord,
  Prev extends __<iR> = __<iR<unknown, UnknownRecord, any, Done>>,
  D extends Done = any,
> = L & {
  /**
   * Value that changes overtime
   *
   * Called when iR propagates information
   */
  x: Cb<X>;

  /**
   * Done / Dispose
   *
   * if `undefined` nothing to dispose (no computation running)
   *
   * if `prev: falsy` must stop immediately - called from observer
   * if `prev: true` must stop once no more tasks to be performed; called from observee
   *
   */
  d?: D;

  /**
   * Previous step in a chain
   *
   * `undefined` for initial iR
   */
  p: Prev;

  /**
   * Next block in a chain
   *
   * `undefined` for final iR
   */
  // n?: iR;
};

/**
 * yR (why-er)
 *
 * wire / chain of iRs
 */
type yR<X = any, L extends UnknownRecord = any, Prev extends yR = yR<any, any, any>, D extends Done = any> = Ko<
  X,
  iR<X, L, ReturnType<Prev>, D>
>;
type yR2X<RC> = RC extends yR<infer X, any> ? X : never;

const iR = <X, L extends UnknownRecord, Prev extends __<yR>, y extends Partial<iR>>(
  x: Cb<X>,
  L: L,
  p: Prev,
  $: ($: iR<X, L, __, __>, p: Prev) => y,
) => u(a(L, { x, p: __ }), (x) => $(x, p)) as Simplify<y & iR<X, L>>;

const iR0 = <X, L extends UnknownRecord, y extends Partial<iR> & { p?: __ }>(
  x: Cb<X>,
  L: L,
  $: ($: iR<X, L, __>) => y,
) => iR(x, L, __, $) as Simplify<y & iR<X, L, __>>;

interface _Input<X> extends iR<X> {
  x: Cb<X>;
  i: (v: X) => X;
  d?: __;
}

type Input<X> = Ko<X, _Input<X>>;

const _I =
  <X>(v: X): Input<X> =>
  (x: Cb<X>) =>
    iR0(
      x,
      { v },
      ($) => (
        $.x(v),
        {
          i: (v: X) => (($.v = v), $.x(v), v),
        }
      ),
    );
export const I = <X>(v: X) => p(_I(v));
I._ = _I;

export interface _FilterMap<X, P extends yR> extends iR<X, {}, ReturnType<P>, __> {
  __: readonly [Fn<[yR2X<P>], X>, "F"];
}
export type FilterMap<X, P extends yR> = Ko<X, _FilterMap<X, P>>;

export const F =
  <const X, P extends yR>(f: Fn<[yR2X<P>], X>) =>
  (P: P): FilterMap<X, P> =>
  (x: Cb<X>) =>
    iR(x, { __: [f, "F"] as const, d: __ }, P, ($, P) => ({
      p: P((x) => $.x($.__[0](x))),
    }));

F.ify = <F extends Fn1>(fn: F) => F(fn) as <P extends yR<Fn$I<F>[0]>>(P: P) => FilterMap<Fn$O<F>, P>;

export const UP =
  <const X extends UnknownRecord, P extends yR>($: (p: Fn$O<P>) => X) =>
  (P: P) =>
  (x: Cb<yR2X<P>>) =>
    u(P(x), $);

export const AD = <const X extends UnknownRecord, P extends yR>(x: X): Fn$O<typeof UP<X, P>> => UP(() => x);

export const ID = <ID extends PropertyKey, P extends yR, K extends PropertyKey = "id">(
  i: ID,
  k = "id" as K,
): Fn$O<typeof UP<{ [k in K]: ID }, P>> => UP(() => ({ [k]: i }));

export const DW = () => 1;

export const RD = () => 1;

/**
 * Helper for disposing iR
 *
 * @param y iR to be disposed
 * @param d clean-up logic
 * @returns a function that should be assigned to y.d; once called with (prev: false) it will unset y.d
 */
export const d = (y: iR, d: () => void) => () => {
  if (!y.d) return; // already disposed -- most likely this is a logic error; there is no need to call it more than once
  d();
  y.d = __;
  let p = y.p as __<iR>;
  // skip non disposable blocks
  while (p && !p.d) {
    p = p.p;
  }
  // the closest disposable block MUST take care to propagate the info down
  p?.d?.();
};

/**
 * Connects two iRs
 *
 * `(p.n = n), (n.p = p))`
 *
 * @param p prev iR
 * @param n next iR
 * @returns void
 */
// const y2y = <Prev extends iR, Next extends iR>(p: Prev, n: Next) => ((p.n = n), (n.p = p));

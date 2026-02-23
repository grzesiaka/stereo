import { Simplify, UnknownRecord } from "type-fest";
import { __, a, Fn, u } from "./0";
import o from "./o";

/**
 * Callback
 */
type Cb<X> = (x: X) => void;

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
  n?: iR;
};

/**
 * yR (why-er)
 *
 * a wire of iRs
 */
type yR<X = any, L extends UnknownRecord = any, Prev extends yR = yR<any, any, any>, D extends Done = any> = (
  c: Cb<X>,
) => iR<X, L, ReturnType<Prev>, D>;
type yR2X<RC> = RC extends yR<infer X, any> ? X : never;
// type yR2L<RC> = RC extends yR<any, infer L extends UnknownRecord> ? L : never;

const $y = <X, L extends UnknownRecord, Prev extends __<yR>, y extends Partial<iR>>(
  x: Cb<X>,
  L: L,
  p: Prev,
  $: ($: iR<X, L, __, __>, p: Prev) => y,
) => u(a(L, { x, p: __ }), (x) => $(x, p)) as Simplify<y & iR<X, L>>;

const $y0 = <X, L extends UnknownRecord, y extends Partial<iR> & { p?: __ }>(
  x: Cb<X>,
  L: L,
  $: ($: iR<X, L, __>) => y,
) => $y(x, L, __, $) as Simplify<y & iR<X, L, __>>;

interface Input<X> extends iR<X> {
  x: Cb<X>;
  i: (v: X) => X;
  d: __;
}
const _I =
  <X>(v: X) =>
  (x: Cb<X>) =>
    $y0(x, { v }, ($) => ({
      i: (v: X) => (($.v = v), $.x(v), v),
    })) as Input<X>;
const I = <X>(v: X) => o(_I(v), {});

interface FilterMap<X, P extends yR> extends iR<X, {}, ReturnType<P>, __> {
  __: readonly [Fn<[yR2X<P>], X>, "<="];
}

const F =
  <X, P extends yR>(f: Fn<[yR2X<P>], X>) =>
  (P: P) =>
  (x: Cb<X>): FilterMap<X, P> =>
    $y(x, { __: [f, "<="] as const, d: __ }, P, ($, P) => ({
      p: P((x) => $.x($.__[0](x))),
      d: __,
    }));

const b = I(1)(
  F((x) => `${x}`),
  F((x) => [x, x] as const),
);

(await b())((x) => x);

// I(1)();
// const

// const y = <X, L extends UnknownRecord = {}, D extends Done = undefined, P extends y = y>(
//   x: Cb<X>,
//   L: L,
//   P: P,
//   $: ($: iR<X, L, __>, P: P) => D,
// ): iR<X, L, D> => u(a(L, { x }) as iR<X, L, __>, (x) => ({ d: $(x, P) }));

/**
 * Helper for disposing iR
 *
 * @param y iR to be disposed
 * @param d clean-up logic
 * @returns a function that should be assigned to y.d; once called with (prev: false) it will unset y.d
 */
const d = (y: iR, d: () => void) => () => {
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
const y2y = <Prev extends iR, Next extends iR>(p: Prev, n: Next) => ((p.n = n), (n.p = p));

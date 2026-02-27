import { $$, __, a, ARR, Fn, Fn$I, Fn$O, Fn1, id, u, WithOP } from "./0";
import p, { Pipe } from "./p";

/**
 * Callback
 */
export type Cb<X = unknown, R = void> = (x: X) => R;

/**
 * **yR** wire
 *
 * (Co)computation of any (0, 1 or more) values of `X` delivered via callback.
 *
 * `R` is support for (co)computation. It should reflect all properties of the (co)computation.
 */
export type yR<X = any, R extends {} = any> = (x: Cb<X>) => R;
export type yR2X<y> = y extends yR<infer X> ? X : never;
export type yR2R<y> = y extends yR<any, infer R> ? R : never;

/**
 * A source of asynchronous values with an explicit observer
 *
 * Having an explicit observer allows runtime manipulation (e.g. dynamic re-routing or deactivation)
 */
export interface WithObserver<X = unknown> {
  x: Cb<X>;
}

/**
 * A stateful context
 */
export interface WithState<X = unknown> {
  v: X;
}

/**
 * Id of single computation unit
 */
export type WithId<Id extends __<PropertyKey> = __> = Id extends PropertyKey
  ? {
      id: Id;
    }
  : {};

/**
 * Id of the whole yR
 *
 * Might be useful when combining multiple computations
 *
 * (Not sure if needed)
 */
export type WithYd<Yd extends __<PropertyKey> = __> = Yd extends PropertyKey
  ? {
      yd: Yd;
    }
  : {};

/**
 * A direct dependency of (co)computation. In most cases a provider / providers of inputs.
 */
export interface WithPrevious<P = unknown> {
  p: P;
}

export type Dispose = () => void;

export interface Disposable {
  d: Dispose;
}

/**
 * A computation that completes with value `Z`.
 *
 * **default (not-present)**: `never`
 */
export interface Completable<Z> extends Disposable {
  z: Promise<Z>;
}

/**
 * A computation that produces up to `N` values.
 *
 * `#` could be calculated automatically when (co)composing.
 *
 * **default (not-present)**: `infinity`
 */
export interface Finite<N extends number> {
  "#": N;
}

export interface yR_Base<X, P extends yR> extends WithObserver<X>, WithPrevious<yR2R<P>> {}

const yR =
  <OP extends string, ParamsRaw extends ARR, Params = ParamsRaw[0]>(
    o: OP,
    r = id as any as (...p: ParamsRaw) => Params,
  ) =>
  <cR, cPrev extends __<yR> = yR, cX = unknown>(
    $: ($: WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, P: cPrev, r: ParamsRaw, ...L: ARR) => cR,
  ) =>
  (...p: ParamsRaw) =>
  (P: cPrev) => {
    const op = [r(...p), o] as [Params, OP];
    const y = (x: Cb<cX>, ...L: ARR) =>
      $({ x, __: op } as WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, P, p, ...L);
    y.__ = [...op, P];
    return y;
  };

const yR0 =
  <OP extends string, ParamsRaw extends ARR, Params = ParamsRaw[0]>(
    o: OP,
    r = id as any as (...p: ParamsRaw) => Params,
  ) =>
  <cR, cX = unknown>($: ($: WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, r: ParamsRaw, ...L: ARR) => cR) =>
  (...i: ParamsRaw) => {
    const op = [r(...i), o] as [Params, OP];
    const y = (x: Cb<cX>, ...L: ARR) =>
      $({ x, __: op } as WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, i, ...L);
    y.__ = op;
    return p(y);
  };

export interface _Input<X = unknown> extends WithObserver<X>, WithState<X> {
  i: (x: X) => X;
}
export type Input<X> = yR<X, _Input<X>>;
export type InputId<X, Id extends PropertyKey> = yR<X, _Input<X> & WithId<Id>>;
export const IN = yR0("IN")<_Input & WithId, [unknown, PropertyKey]>(
  ($, p) => (
    $.x($.__[0]),
    a($, {
      id: p[1],
      v: p[0],
      i: (v: unknown) => (($.v = v), $.x(v), v),
    })
  ),
) as <X, Id extends __<PropertyKey> = __>(x: X, id?: Id) => Pipe<Id extends PropertyKey ? InputId<X, Id> : Input<X>>;

/**
 * Applies a function to a stream value
 *
 * `undefined` (aka `__`) values returned by the function are filtered out
 *
 * @param f a function to apply to each value in a stream
 * @returns a function from previous *yR* P to FilterMap<X, P>
 */
export const F = yR("F")(($, P) => {
  $.__[0] = $.__[0] || (id as any);
  return a($, {
    p: P((x) => {
      const v = $.__[0]!(x);
      v !== __ && $.x(v);
    }),
  });
}) as <P extends yR, const X = yR2X<P>>(f?: Fn<[yR2X<P>], X>) => (P: P) => FilterMap<X, P>;
export const Fify = <F extends Fn1>(fn: F) => F(fn) as <P extends yR<Fn$I<F>[0]>>(P: P) => FilterMap<Fn$O<F>, P>;

export interface _FilterMap<X, P extends yR> extends yR_Base<X, P> {}
export type FilterMap<X, P extends yR> = yR<$$<X>, _FilterMap<X, P>>;

export type UpgRade<X extends {}, P extends yR> = Fn$O<typeof UP<X, P>>;
export const UP =
  <const X extends {}, P extends yR>($: (p: yR2R<P>) => X) =>
  (P: P) =>
  (x: Cb<yR2X<P>>) =>
    u(P(x), $);

export const AD =
  <const X extends {}, P extends yR>($: X): UpgRade<X, P> =>
  (P: P) =>
  (x: Cb<yR2X<P>>) =>
    a(P(x), $);

export const ID = <ID extends PropertyKey, P extends yR, K extends PropertyKey = "id">(
  i: ID,
  k = "id" as K,
): UpgRade<{ [k in K]: ID }, P> => AD({ [k]: i });

export const YD = <YD extends PropertyKey, P extends yR>(i: YD) => ID(i, "yd") as UpgRade<{ yd: YD }, P>;

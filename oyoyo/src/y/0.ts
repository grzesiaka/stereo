import { __, ARR, id, WithOP } from "../0";
import p from "../p";

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

/** A helper for creating an initial yR segment */
export const yR0 =
  <OP extends string, ParamsRaw extends ARR, Params = ParamsRaw[0]>(
    o: OP,
    r = id as any as (...p: ParamsRaw) => Params,
  ) =>
  <cR, cX = unknown>($: ($: WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, r: ParamsRaw, L: ARR) => cR) =>
  <L extends ARR>(...L: L) =>
  (...i: ParamsRaw) => {
    const op = [r(...i), o] as [Params, OP];
    const y = (x: Cb<cX>) => $({ x, __: op } as WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, i, L);
    y.__ = op;
    return p(y, ...L);
  };

/** A helper for creating a subsequent yR segment */
export const yR =
  <OP extends string, ParamsRaw extends ARR, Params = ParamsRaw>(
    o: OP,
    r = ((...x: ParamsRaw) => x) as any as (...p: ParamsRaw) => Params,
  ) =>
  <cR, cPrev extends __<yR> = yR, cX = unknown>(
    $: ($: WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, P: cPrev, r: ParamsRaw, L: ARR) => cR,
  ) =>
  (...p: ParamsRaw) =>
  (P: cPrev, ...L: ARR) => {
    const op = [r(...p), o] as [Params, OP];
    const y = (x: Cb<cX>) => $({ x, __: op } as WithObserver<cX> & WithOP<OP, Params> & Partial<cR>, P, p, L);
    y.__ = [...op, P];
    return y;
  };

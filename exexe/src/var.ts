import { Simplify, Writable } from "type-fest";
import { __, a } from "~js";
import { $$, ARR, Cb, Fn } from "~types";

export interface OO<X> {
  /** current value: last emitted or initial if no emission */
  v: X;
  /** callback */
  x: Cb<X>;
  /** dispose */
  d: () => void;
}

export interface VarBase<X> {
  /** current value: last emitted or initial if no emission */
  V: X;
  /** register observer */
  OO: (x: Cb<X>) => OO<X>;
  /** observer's registry */
  OOs: Set<Cb<X>>;
}

export type VarIO<I = any, O = any, L = any> = (L extends string ? { Id: L } : L) & ((x: I) => O) & VarBase<O>;
export type Var<X = any, L = any> = VarIO<X, X, L>;

export const OO =
  <X>($: Var<X>) =>
  (x: Cb<X>): OO<X> => {
    const o: OO<X> = {
      x,
      // edge-case: .v is still refreshed/accessible after disposed; the .v could be redefine to remember $.v when disposed called
      get v() {
        return $.V;
      },
      d: () => $.OOs.delete(x),
    };
    $.OOs.add(x);
    return o;
  };

export interface VarCtx<X = any, I = any> extends Partial<VarBase<X>> {
  /** a custom function to replace standard fan-out, that has access to Var context   */
  $?: (x: I, $: Writable<VarBase<X>>, $$: <$>($: $) => Writable<$ & VarBase<X>>) => $$<X>;
  /** Id of the variable */
  Id?: string;
  /** Default value */
  DefV?: X;
}

export type VarCtx$O<L, X> =
  L extends VarCtx<any> ? (__ extends L["V"] ? (__ extends L["DefV"] ? __<X> : $$<X>) : $$<X>) : never;

export type $VarIO<
  X,
  cL extends VarCtx<__<X>, any> = VarCtx<__<X>, any>,
  E extends ARR = [],
  I = X,
> = E extends readonly [any, ...any[]]
  ? // custom context
    <const L extends cL>(
      L: E extends [] ? L : (...E: E) => L,
    ) => VarCtx$O<L, X> extends I
      ? Var<VarCtx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>
      : VarIO<I, VarCtx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>
  : // default context
    (<const L extends cL>(
      L?: L,
    ) => VarCtx$O<L, X> extends I
      ? Var<VarCtx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>
      : VarIO<I, VarCtx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>) &
      (<ID extends string, const iX extends __<X>>(
        ...p: [id: ID, defaultValue?: iX]
      ) => Var<__ extends iX ? __<X> : $$<X>, __ extends iX ? ID : { Id: ID; DefV: iX }>);

export const $Var = <X, cL = VarCtx<__<X>>, E extends ARR = [], I = X>(...E: E) =>
  ((L__id__fn, DefV) => {
    let L = (L__id__fn || {}) as VarCtx;
    if (typeof L__id__fn === "string") L = DefV === void 0 ? { Id: L__id__fn } : { Id: L__id__fn, V: DefV, DefV };
    else if (E.length) L = (L__id__fn as Fn<E, VarCtx>)(...E);

    const $: Var = L.$
      ? a((x: X) => (L as Required<VarCtx>).$(x, $, () => $), L)
      : a((x: X) => (($.V = x), $.OOs.forEach((c: any) => c($.V))), L);
    !$.OOs && ($.OOs = new Set());
    !$.OO && (($ as Var<any, any>).OO = OO($));
    "DefV" in $ && ($.V = $.DefV);
    return $;
  }) as $VarIO<X, cL & VarCtx<__<X>, I>, E, I>;

export const VAR = $Var() as $VarIO<unknown> & {
  $: typeof $Var;
  N: $VarIO<number>;
  S: $VarIO<string>;
  B: $VarIO<boolean>;
};

export const Num = VAR as $VarIO<__<number>>;
export const Str = VAR as $VarIO<__<string>>;
export const Bool = VAR as $VarIO<__<boolean>>;

VAR.$ = $Var;
VAR.N = Num;
VAR.S = Str;
VAR.B = Bool;

export default VAR;

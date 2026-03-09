import { Simplify, Writable } from "type-fest";
import { __, a } from "~js";
import { $$, ARR, Cb, Fn } from "~types";

interface OO<X> {
  v: X;
  x: Cb<X>;
  d: () => void;
}

interface VarBase<X> {
  V: X;
  OO: (x: Cb<X>) => OO<X>;
  // TODO make it iterator and allow sorting to address diamond update problem
  OOs: Set<Cb<X>>;
}

type VarIO<I = any, O = any, L = any> = (L extends string ? { Id: L } : L) & ((x: I) => O) & VarBase<O>;
type Var<X = any, L = any> = VarIO<X, X, L>;
// type Var<X = any, L = any> = (L extends string ? { Id: L } : L) & ((x: X) => X) & VarBase<X>;

const OO =
  <X>($: Var<X>) =>
  (x: Cb<X>): OO<X> => {
    const o: OO<X> = {
      x,
      // edge-case: .v is still refreshed/accessible after disposed
      get v() {
        return $.V;
      },
      d: () => $.OOs.delete(x),
    };
    $.OOs.add(x);
    return o;
  };

interface Ctx<X = any, I = any> extends Partial<VarBase<X>> {
  /** a custom function that  */
  $?: (x: I, $: Writable<VarBase<X>>, $$: <$>($: $) => Writable<$ & VarBase<X>>) => $$<X>;
  Id?: string;
  DefV?: X;
}

type Ctx$O<L, X> = L extends Ctx<any> ? (__ extends L["V"] ? (__ extends L["DefV"] ? __<X> : $$<X>) : $$<X>) : never;

// type Ctx$I<L> = L extends Ctx<any, infer X> ? X : never;

type $Var<X, cL extends Ctx<__<X>, any> = Ctx<__<X>, any>, E extends ARR = [], I = X> = E extends readonly [
  any,
  ...any[],
]
  ? // custom context
    <const L extends cL>(
      L: E extends [] ? L : (...E: E) => L,
    ) => Ctx$O<L, X> extends I
      ? Var<Ctx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>
      : VarIO<I, Ctx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>
  : // default context
    (<const L extends cL>(
      L?: L,
    ) => Ctx$O<L, X> extends I
      ? Var<Ctx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>
      : VarIO<I, Ctx$O<L, X>, L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L>) &
      (<ID extends string, const iX extends __<X>>(
        ...p: [id: ID, defaultValue?: iX]
      ) => Var<__ extends iX ? __<X> : $$<X>, __ extends iX ? ID : { Id: ID; DefV: iX }>);

export const $Var = <X, cL = Ctx<__<X>>, E extends ARR = [], I = X>(...E: E) =>
  ((L__id__fn, DefV) => {
    let L = (L__id__fn || {}) as Ctx;
    if (typeof L__id__fn === "string") L = DefV === void 0 ? { Id: L__id__fn } : { Id: L__id__fn, V: DefV, DefV };
    else if (E.length) L = (L__id__fn as Fn<E, Ctx>)(...E);

    const $: Var = L.$
      ? a((x: X) => (L as Required<Ctx>).$(x, $, () => $), L)
      : a((x: X) => (($.V = x), $.OOs.forEach((c: any) => c($.V))), L);
    !$.OOs && ($.OOs = new Set());
    !$.OO && (($ as Var<any, any>).OO = OO($));
    "DefV" in $ && ($.V = $.DefV);
    return $;
  }) as $Var<X, cL & Ctx<__<X>, I>, E, I>;

export const VAR = $Var() as $Var<unknown> & { $: typeof $Var; N: $Var<number>; S: $Var<string>; B: $Var<boolean> };

export const Num = VAR as $Var<__<number>>;
export const Str = VAR as $Var<__<string>>;
export const Bool = VAR as $Var<__<boolean>>;

VAR.$ = $Var;
VAR.N = Num;
VAR.S = Str;
VAR.B = Bool;

export default VAR;

function $() {}

$.a = "";

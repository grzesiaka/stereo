import { Simplify } from "type-fest";
import { __, a } from "~js";
import { $$, ARR, Cb } from "~types";

interface OO<X> {
  v: X;
  x: Cb<$$<X>>;
  d: () => void;
}

interface VarBase<X> {
  V: X;
  OO: (x: Cb<$$<X>>) => OO<X>;
  OOs: Set<Cb<$$<X>>>;
}

type Var<X = any, L = any> = (L extends string ? { Id: L } : L) & ((x: $$<X>) => $$<X>) & VarBase<X>;

const OO =
  <X>($: Var<X>) =>
  (x: Cb<X>): OO<X> => {
    const o: OO<X> = {
      x,
      // .v is still refreshed after disposed
      get v() {
        return $.V;
      },
      d: () => $.OOs.delete(x),
    };
    $.OOs.add(x);
    return o;
  };

interface Ctx<X = any> extends Partial<VarBase<X>> {
  Id?: string;
  DefV?: X;
  Fn?: (x: $$<X>, $: <$>($: $) => $ & VarBase<X>) => $$<X>;
}

type $Var<X, cL extends Ctx<__<X>> = Ctx<__<X>>, E extends ARR = []> = E extends readonly [any, ...any[]]
  ? // custom context
    <L extends cL>(
      L: E extends [] ? L : (...E: E) => L,
    ) => Var<
      __ extends L["V"] ? (__ extends L["DefV"] ? __<X> : $$<X>) : $$<X>,
      L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L
    >
  : // default context
    (<L extends cL>(
      L?: L,
    ) => Var<
      __ extends L["V"] ? (__ extends L["DefV"] ? __<X> : $$<X>) : $$<X>,
      L extends { DefV: any } ? L : L extends { V: any } ? Simplify<Omit<L, "V">> : L
    >) &
      (<ID extends string, const iX extends __<X>>(
        ...p: [id: ID, defaultValue?: iX]
      ) => Var<__ extends iX ? __<X> : $$<X>, __ extends iX ? ID : { Id: ID; DefV: iX }>);

export const $Var = <X, cL = Ctx<__<X>>, E extends ARR = []>(...E: E) =>
  ((idOrL, DefV) => {
    if (E.length) return $Var()((idOrL as any)(...E));
    if (idOrL === void 0) return $Var()({});
    if (typeof idOrL === "string") return $Var()(DefV === void 0 ? { Id: idOrL } : { Id: idOrL, V: DefV, DefV });
    const $: Var = a((x: X) => (($.V = x), idOrL.Fn?.(x, () => $), $.OOs.forEach((c) => c($.V))), idOrL);
    !$.OOs && ($.OOs = new Set());
    !$.OO && (($ as Var<any, any>).OO = OO($));
    "DefV" in $ && ($.V = $.DefV);
    return $;
  }) as $Var<X, cL & Ctx<__<X>>, E>;

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

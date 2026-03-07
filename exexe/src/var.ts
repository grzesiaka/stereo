import { Simplify, Writable } from "type-fest";
import { __, a } from "~js";
import { $$, ARR, Cb } from "~types";

interface OO<X> {
  v: X;
  x: Cb<$$<X>>;
  d: () => void;
}

type Var<X = unknown, L = unknown> = (L extends string ? { id: L } : L) & {
  (v: $$<X>): void;
  v: X;
  OO: (x: Cb<$$<X>>) => OO<X>;
  OOs: Set<Cb<$$<X>>>;
};

const OO =
  <X>($: Var<X>) =>
  (x: Cb<X>): OO<X> => {
    const o: OO<X> = {
      x,
      // .v is still refreshed after disposed
      get v() {
        return $.v;
      },
      d: () => $.OOs.delete(x),
    };
    $.OOs.add(x);
    return o;
  };

interface Ctx<X = any> {
  id?: string;
  v?: X;
  defV?: X;
  OOs?: Set<Cb<$$<X>>>;
}

type $Var<X, cL extends Ctx<__<X>> = Ctx<__<X>>, E extends ARR = []> = E extends readonly [any, ...any[]]
  ? // custom context
    <const L extends cL>(
      L: E extends [] ? L : (...E: E) => L,
    ) => Var<
      __ extends L["v"] ? (__ extends L["defV"] ? __<X> : $$<X>) : $$<X>,
      Writable<L extends { defV: any } ? L : L extends { v: any } ? Simplify<Omit<L, "v">> : L>
    >
  : // default context
    (<const L extends cL>(
      L?: L,
    ) => Var<
      __ extends L["v"] ? (__ extends L["defV"] ? __<X> : $$<X>) : $$<X>,
      Writable<L extends { defV: any } ? L : L extends { v: any } ? Simplify<Omit<L, "v">> : L>
    >) &
      (<ID extends string, const iX extends __<X>>(
        ...p: [id: ID, defaultValue?: iX]
      ) => Var<__ extends iX ? __<X> : $$<X>, __ extends iX ? ID : { id: ID; defV: iX }>);

export const $Var = <X, cL = Ctx<__<X>>, E extends ARR = []>(...E: E) =>
  ((idOrL, defV) => {
    if (E.length) return $Var()((idOrL as any)(...E));
    if (idOrL === void 0) return $Var()({});
    if (typeof idOrL === "string") return $Var()(defV === void 0 ? { id: idOrL } : { id: idOrL, v: defV, defV });
    const $: Var = a((x: X) => (($.v = x), $.OOs.forEach((c) => c($.v))), idOrL);
    !$.OOs && ($.OOs = new Set());
    !$.OO && (($ as Var<any, any>).OO = OO($));
    "defV" in $ && ($.v = $.defV);
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

import { Simplify, Writable } from "type-fest";
import { __, a } from "~js";
import { $$, Cb, FlipOptionalAndRequiredProperties } from "~types";

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

type $Var<X, L extends Ctx<__<X>> = Ctx<__<X>>> =
  // default context
  L extends Ctx<__<X>>
    ? (<const E extends L>(
        e?: E,
      ) => Var<
        __ extends E["v"] ? (__ extends E["defV"] ? __<X> : $$<X>) : $$<X>,
        Writable<E extends { defV: any } ? E : E extends { v: any } ? Simplify<Omit<E, "v">> : E>
      >) &
        (<ID extends string, const iX extends __<X>>(
          ...p: [id: ID, defaultValue?: iX]
        ) => Var<__ extends iX ? __<X> : $$<X>, __ extends iX ? ID : { id: ID; defV: iX }>)
    : // custom context
      <E extends L>(e: FlipOptionalAndRequiredProperties<L>) => Var<Required<L>["v"], Simplify<E & L>>;

export const $Var = <X, cL extends Ctx<__<X>> = Ctx<__<X>>>(cL = {} as cL) =>
  ((idOrL, defV) => {
    if (idOrL === void 0) return $Var({})(cL);
    if (typeof idOrL === "string")
      return ($Var as any)(cL)(defV === void 0 ? { id: idOrL } : { id: idOrL, v: defV, defV });
    const $: Var = a((x: X) => (($.v = x), $.OOs.forEach((c) => c($.v))), cL, idOrL);
    !$.OOs && ($.OOs = new Set());
    !$.OO && (($ as Var<any, any>).OO = OO($));
    "defV" in $ && ($.v = $.defV);
    return $;
  }) as $Var<X, cL>;

export const VAR = $Var() as $Var<unknown> & { $: typeof $Var; N: $Var<number>; S: $Var<string>; B: $Var<boolean> };

export const Num = VAR as $Var<__<number>>;
export const Str = VAR as $Var<__<string>>;
export const Bool = VAR as $Var<__<boolean>>;

VAR.$ = $Var;
VAR.N = Num;
VAR.S = Str;
VAR.B = Bool;

export default VAR;

import { __, a } from "~js";
import { $$, Cb, FlipOptionalAndRequiredProperties, Fn$O } from "~types";

interface OO<X> {
  v: X;
  x: Cb<$$<X>>;
  d: () => void;
}

type Var<X = unknown, L = unknown> = (L extends string ? { id: L } : L) & {
  (v: $$<X>): void;
  v: X;
  OO: <X>(x: Cb<X>) => OO<X>;
  obs: Set<Cb<$$<X>>>;
};

const OO =
  <X>($: Var<X>) =>
  (x: Cb<X>): OO<X> => {
    const o: OO<X> = {
      x,
      get v() {
        return $.v;
      },
      d: () => $.obs.delete(x),
    };
    $.obs.add(x);
    return o;
  };

interface DefaultContext<X = any> {
  id?: string;
  v?: __<X>;
  obs?: Set<Cb<$$<X>>>;
}

type $Var<X, L = DefaultContext<X>> =
  L extends DefaultContext<X>
    ? (<E extends L>(e?: E) => Var<X, E>) &
        (<ID extends string, iX extends __<X>>(
          ...p: [ID, iX?]
        ) => Var<X, __ extends iX ? { id: ID } : { id: ID; initV: iX }>)
    : //  : [L, DefaultContext];
      <E extends L>(e: FlipOptionalAndRequiredProperties<L>) => Var<X, E>;

export const $Var =
  <X, cL = DefaultContext<X>>(cL?: cL): $Var<X, cL> =>
  // @ts-expect-error different number of params supported
  (idOrL, defV) => {
    // @ts-expect-error most likely TS limitation
    if (idOrL === void 0) return $Var(cL)(cL);
    // @ts-expect-error most likely TS limitation
    if (typeof idOrL === "string") return $Var(cL)(defV === void 0 ? { id: idOrL } : { id: idOrL, defV });
    const $: Var<any, any> = a(() => 1, cL, idOrL);
    !($ as Var).obs && (($ as Var).obs = new Set());
    !($ as Var).OO && (($ as Var).OO = OO($));
    return $;
  };

export const VAR = $Var() as Fn$O<typeof $Var> & { $: typeof $Var; N: $Var<number>; S: $Var<string>; B: $Var<boolean> };

export const Num = VAR as $Var<number>;
export const Str = VAR as $Var<string>;
export const Bool = VAR as $Var<boolean>;

VAR.$ = $Var;
VAR.N = Num;
VAR.S = Str;
VAR.B = Bool;

export default VAR;

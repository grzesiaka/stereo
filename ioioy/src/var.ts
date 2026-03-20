import { __, Cb } from "~js";
import cId from "~js/ctxid";
import { IO } from "./io";

export type Var<Ctx = unknown, X = unknown> = IO<X, X, X, Ctx> & { OO: Set<Cb<X>> };

export const Var = <X, const Ctx = __>(x: X, L?: Ctx): Var<Ctx, X> => {
  const $ = {
    I: cId((x: X) => ((($.I as any).V = x), $.OO.forEach((c) => c(x)), x), L, { V: x }),
    O: cId((c?: Cb<X>) => (!c ? $.I.V : ($.OO.add(c), c($.I.V as X), () => $.OO.delete(c))), L),
    OO: new Set<Cb<X>>(),
  } as Var<Ctx, X>;
  $.I.V;
  return $;
};

export default Var;

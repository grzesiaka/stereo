import { __, Cb } from "~js";
import { ctx, IO } from "./io";

export type Var<Ctx = unknown, X = unknown> = IO<X, X, X, Ctx> & { OO: Set<Cb<X>> };

export const Var = <X, const Ctx = __>(x: X, L?: Ctx): Var<Ctx, X> => {
  const $ = {
    OO: new Set<Cb<X>>(),
    I: ctx((x: X) => (($.I.V = x as any), $.OO.forEach((c) => c(x)), x), L, { V: x }),
    O: ctx((c?: Cb<X>) => (!c ? $.I.V : ($.OO.add(c), c($.I.V as X), () => $.OO.delete(c))), L),
  } as Var<Ctx, X>;
  $.I.V;
  return $;
};

export default Var;

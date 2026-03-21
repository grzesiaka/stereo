import { __, Cb } from "~js";
import cId, { CtxIdConstraint } from "~js/ctxid";
import { IO } from "./io";

export type Var<Ctx extends CtxIdConstraint = __, X = unknown> = IO<X, X, X, Ctx> & { OO: Set<Cb<X>> };

export const Var = <X, const Ctx extends CtxIdConstraint = __>(X: X, L?: Ctx): Var<Ctx, X> => {
  const $ = {
    X: X,
    I: (x: X) => (($.X = x), $.OO.forEach((c) => c(x)), x),
    O: cId((c?: Cb<X>) => (!c ? $.X : ($.OO.add(c), c($.X), () => $.OO.delete(c))), L),
    OO: new Set<Cb<X>>(),
  } as Var<Ctx, X> & { X: X };
  return $;
};

export default Var;

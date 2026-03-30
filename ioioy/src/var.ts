import { __, Cb, is } from "jsyoyo";
import cId, { CtxIdConstraint } from "jsyoyo/ctxid";
import { IO } from "./io";
import { ARR } from "~types";
import { OP, WithOP } from "xpresyo";

export type Var<Ctx extends CtxIdConstraint = __, X = unknown, IX = X, Params = __> = IO<IX, X, X, Ctx, IX> &
  WithOP<"VR", Params> & { OO: Set<Cb<X>> };

export type IdVar = Var<any, any> & { O: { Id: string } };
export type IdVars = ARR<IdVar>;

export const Var = <X, const Ctx extends CtxIdConstraint = __>(X: X, L?: Ctx): Var<Ctx, X> => {
  const $ = OP("VR")(__)({
    X: X,
    I: (x: X) => (($.X = x), $.OO.forEach((c) => c(x)), x),
    O: cId((c?: Cb<X>) => (!c ? $.X : ($.OO.add(c), c($.X), () => $.OO.delete(c))), L),
    OO: new Set<Cb<X>>(),
  }) as Var<Ctx, X> & { X: X };
  return $;
};
Var.$ =
  <X>(x: X) =>
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
    Var(x, L);
Var.$L =
  <const Ctx extends CtxIdConstraint = __>(L = __ as Ctx) =>
  <X>(x: X | ((L: Ctx) => X)) =>
    is.fun(x) ? Var(x(L), L) : Var(x, L);
Var.B = Var.$(false);
Var.N = Var.$(0);
Var.S = Var.$("");

export default Var;

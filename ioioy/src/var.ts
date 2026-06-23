import { __, Cb, is_fun } from "jsyoyo";
import cId, { CtxIdConstraint } from "jsyoyo/ctxid";
import { IO } from "./io";
import { ARR } from "~types";
import { OP, WithOP } from "jsyoyo";

export type Var<Ctx extends CtxIdConstraint = __, X = unknown, IX = X, Params = __> = IO<IX, X, X, Ctx, IX> &
  WithOP<"VR", Params> & { OO: Set<Cb<X>> };

export type IdVar = Var<any, any, any, any> & { O: { Id: string } };
export type IdVars = ARR<IdVar>;

export const Var = <X, const Ctx extends CtxIdConstraint = __>(X: X, L?: Ctx): Var<Ctx, X> => {
  const $ = OP("VR")(__)({
    X: X,
    I: (x: X) => (($.X = x), $.OO.forEach((c) => c(x)), x),
    O: cId(
      // @ts-expect-error upon `pnpm refresh` it is reported; but sometimes in IDE it disappears
      // oxlint-disable-next-line no-unused-vars apparently skipInitial is not used; seems to be a bug in oxc
      (c?: Cb<X>, skipInitial = false) => (!c ? $.X : ($.OO.add(c), !skipInitial && c($.X), () => $.OO.delete(c))),
      L,
    ),
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
    is_fun(x) ? Var(x(L), L) : Var(x, L);
Var.B = Var.$(false);
Var.N = Var.$(0);
Var.S = Var.$("");

export default Var;

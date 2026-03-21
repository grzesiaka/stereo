import { __, Cb } from "~js";
import cId, { CtxIdConstraint } from "~js/ctxid";
import { IO } from "./io";

export type Event<Ctx extends CtxIdConstraint = __, X = unknown> = IO<X, X, __, Ctx> & { OO: Set<Cb<X>> };

export const Event =
  <X>() =>
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx): Event<Ctx, X> => {
    const $ = {
      OO: new Set<Cb<X>>(),
      X: __,
      I: (x: X) => ($.OO.forEach((c) => c(x)), x),
      O: cId((c?: Cb<X>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
    } as Event<Ctx, X>;
    return $;
  };

export default Event;

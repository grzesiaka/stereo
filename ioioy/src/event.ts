import { __, Cb } from "jsyoyo";
import cId, { CtxIdConstraint } from "jsyoyo/ctxid";
import { IO } from "./io";
import { OP, WithOP } from "xpresyo";

export type Event<Ctx extends CtxIdConstraint = __, X = unknown> = IO<X, X, __, Ctx> &
  WithOP<"EV", Ctx> & { OO: Set<Cb<X>> };

export const Event = (<X>() =>
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx): Event<Ctx, X> => {
    const $ = OP("EV")(L)({
      OO: new Set<Cb<X>>(),
      I: (x: X) => ($.OO.forEach((c) => c(x)), x),
      O: cId((c?: Cb<X>) => (!c ? __ : ($.OO.add(c), () => $.OO.delete(c))), L),
    }) as Event<Ctx, X>;
    return $;
  }) as (<X>() => <const Ctx extends CtxIdConstraint = __>(L?: Ctx) => Event<Ctx, X>) & {
  B: <const Ctx extends CtxIdConstraint = __>(L?: Ctx) => Event<Ctx, boolean>;
  N: <const Ctx extends CtxIdConstraint = __>(L?: Ctx) => Event<Ctx, number>;
  S: <const Ctx extends CtxIdConstraint = __>(L?: Ctx) => Event<Ctx, string>;
  $: <X>() => Event<__, X>;
  $L: <const Ctx extends CtxIdConstraint = __>(L?: Ctx) => <X>() => Event<Ctx, X>;
};

Event.B = Event.N = Event.S = Event<any>();
Event.$L = (L) => () => Event<any>()(L);

export default Event;

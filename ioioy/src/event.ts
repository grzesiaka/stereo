import { __, Cb } from "~js";
import cId from "~js/ctxid";
import { IO } from "./io";

export type Event<Ctx = unknown, X = unknown> = IO<X, X, __, Ctx> & { OO: Set<Cb<X>> };

export const Event =
  <X>() =>
  <const Ctx>(L?: Ctx): Event<Ctx, X> => {
    const $ = {
      OO: new Set<Cb<X>>(),
      I: cId((x: X) => ($.OO.forEach((c) => c(x)), x), L, { V: __ }),
      O: cId((c?: Cb<X>) => (!c ? $.I.V : ($.OO.add(c), () => $.OO.delete(c))), L),
    } as Event<Ctx, X>;
    return $;
  };

export default Event;

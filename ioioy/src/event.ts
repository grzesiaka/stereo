import { __, Cb } from "~js";
import { ctx, IO } from "./io";

export type Event<X = unknown, Ctx = unknown> = IO<X, X, __, Ctx, { CBs: Set<Cb<X>> }>;

export const Event =
  <X>() =>
  <Ctx>(L?: Ctx): Event<X, Ctx> => {
    const $ = {
      CBs: new Set<Cb<X>>(),
      I: ctx((x: X) => ($.CBs.forEach((c) => c(x)), x), L, { V: __ }),
      O: (c?: Cb<X>) => (!c ? $.I.V : ($.CBs.add(c), () => $.CBs.delete(c))),
    } as Event<X, Ctx>;
    return $;
  };

export default Event;

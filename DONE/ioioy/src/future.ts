import { __, Cb } from "jsyoyo";
import cId, { CtxIdOptional } from "jsyoyo/ctxid";
import { IO } from "./io";
import { OP, WithOP } from "jsyoyo";

export type Future<Ctx extends CtxIdOptional = __, X = unknown> = IO<X, X, __<X>, Ctx> &
  WithOP<"FUT", Ctx> & { OO: Set<Cb<X>>; X?: __<X> };

export const Future =
  <X>() =>
  <const Ctx extends CtxIdOptional = __>(L?: Ctx): Future<Ctx, X> => {
    const $ = OP("FUT")(L)({
      OO: new Set<Cb<X>>(),
      I: (x: X) => (($.X = x), $.OO.forEach((c) => c(x)), x),
      O: cId((c?: Cb<X>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
    }) as Future<Ctx, X> & { X?: X };
    if ("#" in $.O) {
      $.I = (x: X) =>
        (($.O as never as { "#": number })["#"] > 0 &&
          (($.X = x), ($.O as never as { "#": number })["#"]--, $.OO.forEach((c) => c(x)), x)) ||
        x;
    }
    return $;
  };

Future.$ = <X>() => Future<X>()() as Future<__, X>;
/**
 * Creates a future that emits maximally once.
 */
Future.$1 = <X>() => Future<X>()({ "#": 1 }) as Future<{ readonly "#": 1 }, X>;

export default Future;

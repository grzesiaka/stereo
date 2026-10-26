import { __, Cb, id } from "jsyoyo";
import cId, { CtxIdOptional } from "jsyoyo/ctxid";
import { IO } from "./io";
import { OP, WithOP } from "jsyoyo";
import { pipe } from "composyo";

export type Future<Ctx extends CtxIdOptional = __, O = unknown, I = O> = IO<I, O, __<O>, Ctx, O> &
  WithOP<"FUT", Ctx> & { FN: (i: I) => O; OO: Set<Cb<O>>; X?: __<O> };

export const Future =
  <O, I = O>(FN = id as (i: I) => O) =>
  <const Ctx extends CtxIdOptional = __>(L?: Ctx): Future<Ctx, O, I> => {
    const $ = OP("FUT")(L)({
      FN,
      OO: new Set<Cb<O>>(),
      I: (x: I) => (($.X = $.FN(x)), $.OO.forEach((c) => c($.X!)), $.X),
      O: cId((c?: Cb<O>) => (!c ? $.X : ($.OO.add(c), $.X !== __ && c($.X), () => $.OO.delete(c))), L),
      get O$() {
        return pipe(this.O);
      },
    }) as Future<Ctx, O, I> & { X?: O };
    if ("#" in $.O) {
      $.I = (x: I) =>
        (($.O as never as { "#": number })["#"] > 0 &&
          (($.X = $.FN(x)), ($.O as never as { "#": number })["#"]--, $.OO.forEach((c) => c($.X!)), $.X)) ||
        ($.X as O);
    }
    return $;
  };

Future.$ = <O, I = O>(FN = id as (i: I) => O) => Future(FN)() as Future<__, O, I>;
/**
 * Creates a future that emits maximally once.
 */
Future.$1 = <O, I = O>(FN = id as (i: I) => O) => Future(FN)({ "#": 1 }) as Future<{ readonly "#": 1 }, O, I>;

export default Future;

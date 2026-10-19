import { Fn$O, id } from "jsyoyo";
import { OP, $OP, Yo, oYo, Yo$X, WithCompletable, makeCompletable, observeCompleted } from "../base/yo";

type TakeCtx<Count extends number = number> = WithCompletable<number, { "#": Count; i: number }>;

export type Take<Count extends number, Prev extends Yo> = OP<Yo$X<Prev>, Prev, TakeCtx<Count>, "take", Count>;
export type Take$<Count extends number, Prev extends oYo> = $OP<Take<Count, Fn$O<Prev>>>;
export type TakeOp = <Count extends number, Prev extends oYo>(count: Count) => (Y: Prev) => Take$<Count, Prev>;

export const take = Yo<"take", [number], number>(
  "take",
  id,
)<TakeCtx>(($, P, [count]) => {
  const [complete] = makeCompletable($);
  $.i = 0;
  $["#"] = count;
  $.Y = P((x) => {
    if ($.i! < $["#"]!) {
      $.o(x);
      $.i!++;
      $.i === $["#"] && complete($.i);
    }
  });
  count < 1 ? complete(0) : observeCompleted($.Y, () => complete($.i));
}) as never as TakeOp;

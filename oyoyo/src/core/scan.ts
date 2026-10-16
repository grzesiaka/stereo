import { __, dethunk, Fn, Fn$O } from "jsyoyo";
import { OP, $OP, Yo, oYo, oYo$X, Yo$X } from "../base/yo";

export type Scan<X, Prev extends Yo, Acc> = OP<
  X,
  Prev,
  { X: X },
  "scan",
  [f: Fn<[acc: X, value: Yo$X<Prev>], X>, seed?: Acc | (() => Acc)]
>;

export type Scan$<X, Prev extends oYo, Acc> = $OP<Scan<X, Fn$O<Prev>, Acc>>;

export type ScanOp = <Prev extends oYo, X = oYo$X<Prev>, Acc extends __<X> = __>(
  f: Fn<[acc: X, value: oYo$X<Prev>], X>,
  seed?: Acc | (() => Acc),
) => (Y: Prev) => Scan$<X, Prev, Acc>;

export const scan = Yo<"scan", [Fn, unknown?]>("scan")<{ X: unknown }>(($, P, [_, seed]) => {
  const up = (x: unknown) => (($.X = $.__[1][0]($.X, x)), $.o($.X));
  if (seed !== __) {
    $.X = dethunk(seed);
    $.Y = P(up);
  } else {
    $.Y = P((x) => (($.X = x), $.Y && ($.Y.o = up), $.o(x)));
    "X" in $ && ($.Y.o = up); // in case of synchronous update
  }
}) as never as ScanOp;

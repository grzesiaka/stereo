import { __, dethunk, Fn } from "jsyoyo";
import { Yo, oYo, oYo$X } from "./yo";

export type Scan<X, Prev extends oYo, Acc> = oYo<X, Prev, __ extends Acc ? {} : { X: X }>;

export type ScanOp = <Prev extends oYo, X = oYo$X<Prev>, Acc extends __<X> = __>(
  f: Fn<[acc: X, value: oYo$X<Prev>], X>,
  seed?: Acc | (() => Acc),
) => (P: Prev) => Scan<X, Prev, Acc>;

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

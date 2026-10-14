import { __, dethunk, Fn } from "jsyoyo";
import { $yo, yo, yo$X } from "./yo";

export type Scan<X, Prev extends yo> = yo<X, Prev, { acc?: X }>;

export type ScanOp = <Prev extends yo, X = yo$X<Prev>, Acc = X>(
  f: Fn<[value: yo$X<Prev>, acc: Acc], X>,
  seed?: X | (() => X),
) => (P: Prev) => Scan<X, Prev>;

export const scan = $yo<"scan", [Fn, Fn?]>("scan")<{ acc: any }>(($, P, [_, seed]) => {
  const up = (x: any) => {
    $.acc = $.__[1][0](x, $.acc);
    $.I($.acc);
    return x;
  };
  if (seed !== __) {
    $.acc = dethunk(seed);
    $.P = P(up);
  } else {
    $.P = P((x) => (($.acc = x), $.P && ($.P.I = up), $.I(x)));
    "acc" in $ && ($.P.I = up); // in case of synchronous update
  }
}) as never as ScanOp;

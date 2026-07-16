import { ARR } from "~types";
import { o } from "composyo";
export const reduce =
  <EXP, X = {}>(reduceFn: (x: X) => (ps: Reduceable<EXP>) => unknown, x = {} as X) =>
  (exp: EXP) =>
    1;

type ReduceableArr<X> = X extends readonly [infer H, ...infer R] ? [Reduceable<H>, ...ReduceableArr<R>] : [];

type Reduceable<X> = X extends readonly [...infer H, infer R extends ARR] ? [...H, R] | ReduceableArr<R>[number] : X;

o(x())(
  reduce((a) => (x) => {
    switch (x[0]) {
      case "A":
        return x[1];
    }
  }),
);
export default reduce;

function x() {
  return [
    "a",
    1,
    [
      ["b", 2],
      ["c", 3],
      ["D", "D", [["A", "a", [["AA", "aa"]]]]],
    ],
  ] as const;
}

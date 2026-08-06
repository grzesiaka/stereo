import { describe } from "~testing";

import o from "composyo/o";

import map from "../src/map";
import { TREExprs } from "../src";

const base = [
  ["a", { a: "A" }],
  ["b", { b: "B" }],
  ["c", { c: "C" }],
] as const;
const [A, B, C] = base;
type Expr = TREExprs<(typeof base)[number]>;

describe(map, ({ eq }) => ({
  simple: () => {
    const e = [A, B, B, C, C, C] satisfies Expr;
    const x = map<Expr>((x) => {
      switch (x[0]) {
        case "a":
          return x[1][x[0]] as "A";
        case "b":
          return x[1][x[0]] as "B";
        case "c":
          return x[1][x[0]] as "C";
      }
      return x[1][x[0]] as "A";
    })(e);
  },

  empty: () => {
    const e = [] as TREExprs<["0", "0"] | ["1", "1"]>;
    const x = map<TREExprs<["0", "0"] | ["1", "1"]>>(() => 0)(e);
    eq(x, []);

    const p = o(e)(
      (x) => x,
      map(() => 1),
    )();
    eq(p, []);
  },
}));

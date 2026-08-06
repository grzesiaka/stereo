import { describe } from "~testing";

import o from "composyo/o";

import map from "../src/map";
import { TREExprs } from "../src";

const base = [
  ["a", { a: "A" }],
  ["b", { b: "B" }],
  ["c", { c: "C" }],
  ["d", { d: "D" }],
] as const;
const [A, B, C, D] = base;
type Expr = TREExprs<(typeof base)[number]>;

describe(map, ({ eq }) => ({
  nested: () => {
    const e = [A[0], A[1], [B, B, [C[0], C[1], [D, D]]]] satisfies Expr;
    const x = map<"A" | "B" | "C" | "D", Expr>((x) => (x as any)[1][x[0]])(e);
    eq(x, ["A", ["B", "B", ["C", ["D", "D"]]]]);

    map<"A" | "B" | "C" | "D", Expr>((x, from, kids) => {
      switch (x[0]) {
        case "a":
          eq(from, []);
          eq(kids, ["B", "B", ["C", ["D", "D"]]]);
          return x[1][x[0]];
        case "b":
          eq(from, [e]);
          eq(kids, void 0);
          return x[1][x[0]];
        case "c":
          eq(from, [e]);
          eq(kids, ["D", "D"]);
          return x[1][x[0]];
        case "d":
          eq(from, [e, e[2][2]]);
          eq(kids, void 0);
          return x[1][x[0]];
      }
    })(e);
  },

  simple: () => {
    const e = [A, B, B, C, C, C] satisfies Expr;
    const x = map<"A" | "B" | "C" | "D", Expr>((x, from, kids) => {
      switch (x[0]) {
        case "a":
          eq(from, []);
          eq(kids, void 0);
          return x[1][x[0]];
        case "b":
          return x[1][x[0]];
        case "c":
          return x[1][x[0]];
        default:
          return x[1][x[0]];
      }
    })(e);
    eq(x, ["A", "B", "B", "C", "C", "C"]);
  },

  empty: () => {
    const e = [] as TREExprs<["0", "0"] | ["1", "1"]>;
    const x = map<0, TREExprs<["0", "0"] | ["1", "1"]>>(() => 0)(e);
    eq(x, []);

    const p = o(e)(
      (x) => x,
      map(() => 1),
    )();
    eq(p, []);
  },
}));

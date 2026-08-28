import { describe } from "~testing";

import reduce from "../src/reduce";
import { TREExprs } from "../src";
import { o } from "composyo";

const base = [
  ["a", { a: "A" }],
  ["b", { b: "B" }],
  ["c", { c: "C" }],
  ["d", { d: "D" }],
] as const;
const [A, B, C, D] = base;
type TagLetter = (typeof base)[number];
type Expr = TREExprs<TagLetter>;

// Implementation via 'map'; no need for extensive tests.
describe(reduce, ({ eq }) => ({
  nested: () => {
    const e = [A[0], A[1], [B, B, [C[0], C[1], [D, D]]]] satisfies Expr;
    const R = reduce(() => [] as unknown[]);
    const res = ["b", 1, "b", 1, "d", 2, "d", 2, "c", 1, "a", 0];
    const x = R<TagLetter>((R) => (x, from) => R.push(x[0], from.length))(e);
    // kids first, node later
    eq(x, res);

    // TODO type inference is kindof broken; type must be explicitly provided
    const y = o(e)(R<TagLetter>((R) => (x, from) => R.push(x[0], from.length)))();
    eq(y, res);
  },
}));

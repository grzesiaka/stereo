import { describe } from "~testing";

import { deact, DeAST } from "../src/deact";
import { acted } from "../src/acted";

describe(deact, ({ eq }) => ({
  fn: () => {
    const F = { f: (_: "A") => 1 };
    const f = deact(F);
    const ast = ["f", ["A"]] as const satisfies DeAST<typeof f>;
    eq(ast, f.f("A")());
    const x = acted(F)(ast);
    eq(x, 1);
  },
  nested: () => {
    const Tree = {
      A: (_: 1) => 2 as const,
      AA: {
        A: (_: "a") => "B",
      },
    } as const;

    const ast = [
      "A",
      [1],
      [
        ["AA.A", ["a"]],
        ["AA.A", ["a"]],
        ["A", [1]],
      ],
    ] as const satisfies DeAST<typeof Tree>;

    const d = deact(Tree);
    const x = d.A(1)(d.AA.A("a")(), d.AA.A("a")(), d.A(1)());
    eq(ast, x);

    const A = acted(Tree);
    const r = [2, ["B", "B", 2]] as [2, ["B", "B", 2]];
    eq(A(ast), r);
    const x2 = A(d.A(1)(d.AA.A("a")(), d.AA.A("a"), d.A(1)()));
    eq(x2, r);
  },
}));

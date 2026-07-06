import { describe } from "~testing";

import { deact, DeAST } from "../src/deact";

describe(deact, ({ eq }) => ({
  fn: () => {
    const F = { f: (_: "A") => 1 };
    const f = deact(F);
    const ast = ["f", ["A"]] as const satisfies DeAST<typeof f>;
    eq(ast, ["f", ["A"]]);
  },
  nested: () => {
    const Tree = {
      A: (_: 1) => 2,
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
  },
}));

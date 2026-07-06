import { describe } from "~testing";

import { deact, DeAST } from "../src/deact";

describe(deact, ({ eq }) => ({
  ast: () => {
    const Tree = {
      A: (x: 1) => 2,
      AA: {
        A: (a: "a") => "B",
      },
    } as const;
    type Tree = typeof Tree;

    const ast = [
      "A",
      [1],
      [
        ["AA.A", ["a"]],
        ["AA.A", ["a"]],
        ["A", [1]],
      ],
    ] as const satisfies DeAST<Tree>;

    const d = deact(Tree);
    const x = d.A(1)(d.AA.A("a")(), d.AA.A("a")(), d.A(1)());
    eq(ast, x);
  },
}));

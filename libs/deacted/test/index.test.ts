import { describe } from "~testing";

import { deact, Deact$AST } from "../src/deact";
import { acted } from "../src/acted";

describe(deact, ({ eq }) => ({
  fn: () => {
    const F = { f: (_: "A") => 1 };
    const f = deact(F);
    const ast = ["f", ["A"]] as const satisfies Deact$AST<typeof f>;
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
    ] as const satisfies Deact$AST<typeof Tree>;

    const d = deact(Tree);
    const x = d.A(1)(d.AA.A("a")(), d.AA.A("a")(), d.A(1)());
    eq(ast, x);

    const A = acted(Tree);
    const r = [2, ["B", "B", 2]] as [2, ["B", "B", 2]];
    eq(A(ast), r);
    const x2 = A(d.A(1)(d.AA.A("a")(), d.AA.A("a"), d.A(1)()));
    eq(x2, r);
  },

  merge_params: () => {
    const Tree = {
      A: (_: { a: "a" }) => ({ A: "A" }) as const,
      BB: {
        B: (_: { b: "b" }) => ({ B: "B" }) as const,
      },
    } as const;

    const ast = [
      "A",
      [{ a: "a" }],
      [
        ["BB.B", [{ b: "b" }]],
        ["BB.B", [{ b: "b" }]],
        ["A", [{ a: "a" }]],
      ],
    ] as const satisfies Deact$AST<typeof Tree>;

    const d = deact(Tree);
    const x = d.A({ a: "a" })(d.BB.B({ b: "b" })(), d.BB.B({ b: "b" })(), d.A({ a: "a" })());
    eq(ast, x);

    const A = acted(Tree, true);
    const aA = { a: "a", A: "A" };
    const bB = { b: "b", B: "B" };
    const r = [aA, [bB, bB, aA]] as [{ a: "a"; A: "A" }, [{ b: "b"; B: "B" }, { b: "b"; B: "B" }, { a: "a"; A: "A" }]];
    eq(A(ast), r);
    const x2 = A(d.A({ a: "a" })(d.BB.B({ b: "b" })(), d.BB.B({ b: "b" }), d.A({ a: "a" })()));
    eq(r, x2);
  },
}));

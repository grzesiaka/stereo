import { describe } from "~testing";

import { expressify } from "../src/expressify";

describe(expressify, ({ eq }) => ({
  simple: () => {
    const nodes = {
      $: {
        R: () => ({ type: "ROW", elements: (..._: any[]) => 1 }) as const,
        C: () => ({ type: "COL", elements: (..._: any[]) => 1 }) as const,
      },
    } as const;

    const leaves = {
      Txt: <T extends string, Type extends "h1" | "p">(text: T, type = "p" as Type) =>
        ({
          text,
          type,
        }) as const,
    } as const;

    const { cmd, run } = expressify(
      nodes,
      leaves,
    )((n, k) => {
      n.elements(k);
      return n;
    });

    const $ = cmd.$;
    const T = cmd.Txt;
    const ast = $.R()($.C()(T("Head1"), T("Bla")), $.C()(T("Head2"), T("Bla 2")));
    const r = run(ast);
    const c2 = r.__[2][1];
    eq(c2.type, "COL");
    eq(c2.__[2][1].text, "Bla 2");
    eq(c2.__[2][1].__, ["Txt", ["Bla 2"]]);
  },
}));

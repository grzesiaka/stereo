import { describe } from "~testing";

import { expressify } from "../src/expressify";

describe(expressify, ({ eq }) => ({
  empty: () => {
    const EX = expressify({});
  },

  simple: () => {
    const nodes = {
      $: {
        R: () => ({ type: "ROW", elements: (...ps: any[]) => 1 }) as const,
        C: () => ({ type: "COL", elements: (...ps: any[]) => 1 }) as const,
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
      console.log("--->", n, k);
      return n;
    });

    const $ = cmd.$;
    const T = cmd.Txt;
    const ast = $.R()($.C()(T("Head1"), T("Bla bla bla")), $.C()(T("Head2"), T("Bla bla bla 2")));
    const r = run(ast);

    console.log("-------");
    console.log(r);
  },
}));

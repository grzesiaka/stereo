import { describe } from "~testing";

import { commandifyLeaves, commandify, $commandify, Command } from "../src/commandify";

describe(commandifyLeaves, ({ eq }) => ({
  empty: () => {
    const F = commandifyLeaves({});
    eq(F, {});
  },
  single: () => {
    const F = commandifyLeaves((a: "A") => [a]);
    eq(F("A"), ["", ["A"]]);
  },
  object: () => {
    const F = commandifyLeaves({ a: (x: "A") => [x], b: (x: "B") => [x] });
    eq(F.a("A"), ["a", ["A"]]);
    eq(F.b("B"), ["b", ["B"]]);
  },
  nested: () => {
    const F = commandifyLeaves({
      a: (x: "A") => [x],
      b: (x: "B") => [x],
      c: {
        d: (x: "D") => [x],
      },
    });
    eq(F.a("A"), ["a", ["A"]]);
    eq(F.b("B"), ["b", ["B"]]);
    eq(F.c.d("D"), ["c.d", ["D"]]);
  },
}));

describe(commandify, ({ eq }) => ({
  empty: () => {
    const F = commandify({});
    eq(F, {});
  },
  single: () => {
    const F = $commandify<number>()((a: "A") => [a]);
    eq(F("A")(1, 2, 3), ["", ["A"], [1, 2, 3]]);
  },
  object: () => {
    const F = commandify({ a: (x: "A") => [x], b: (x: "B") => [x] });
    eq(F.a("A")(F.b("B")()), ["a", ["A"], [["b", ["B"]]]]);
  },
  nested: () => {
    const F = commandify({
      a: (x: "A") => [x],
      b: (x: "B") => [x],
      c: {
        d: (x: "D") => [x],
      },
    });

    eq(F.a("A")(), ["a", ["A"]]);
    eq(F.b("B")(), ["b", ["B"]]);
    eq(F.c.d("D")(), ["c.d", ["D"]]);

    const r = [
      "c.d",
      ["D"],
      [
        ["a", ["A"], [["c.d", ["D"]]]],
        ["b", ["B"]],
      ],
    ] as const satisfies Command<typeof F>;

    eq(F.c.d("D")(F.a("A")(F.c.d("D")()), F.b("B")()), r);
  },
}));

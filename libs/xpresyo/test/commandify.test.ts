import { describe } from "~testing";

import { commandifyLeaves } from "../src/commandify";

describe(commandifyLeaves, ({ eq }) => ({
  empty: () => {
    const F = commandifyLeaves({});
    eq(F, {});
  },
  single: () => {
    const F = (x: "A") => [x];
    eq(F("A"), ["A"]);
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

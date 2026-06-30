import { describe } from "~testing";

import { fromObject as $ } from "../src";

describe($, ({ eq }) => ({
  "empy []": () => eq($({}), []),
  "empty {}": () => eq($({}, 1), {}),
  "[]": () => {
    const r = $({ a: "A", b: "B" });
    const [a, b] = r;
    eq(r.length, 2);
    eq(a!.O.Id, "a");
    eq(b!.O.Id, "b");
    if (a!.X === "A") {
      eq("a", a!.O.Id);
    }
    if (a!.O.Id === "a") {
      eq("A", a!.O());
      // @ts-expect-error typescript sees .X as 'A' | 'B'
      eq("A", a!.X);
    }
  },

  "{}": () => {
    const r = $({ a: "A", b: "B" }, true);
    const { a, b } = r;
    eq(a!.O.Id, "a");
    eq(b!.O.Id, "b");
    if (a!.X === "A") {
      eq("a", a!.O.Id);
    }
    if (a!.O.Id === "a") {
      eq("A", a!.O());
      eq("A", a!.X);
    }
  },
}));

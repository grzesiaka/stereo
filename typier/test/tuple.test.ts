import { describe } from "~testing";
import { Check } from "typebox/value";

import { Str } from "../src/atoms/index";
import { Tup, Arr } from "../src/compounds";

describe(Tup, ({ eq }) => ({
  empty: () => {
    const t = Tup([])("", "?");
    eq(t.$TYP, "");
    eq(t.$KEY, "");
    eq(t["~optional"], true);
    eq(Check(t, []), true);
    eq(Check(t, {}), false);
    eq(Check(t, [1]), false);
    eq(Check(t, 1), false);
  },
  pair: () => {
    const p = Str({ minLength: 1 })("1");
    const a = Arr(p, { minItems: 1 })("1", "?");
    const t = Tup([p, a])("2");
    eq(t.$TYP, "2");
    eq(t.$KEY, "2");
    eq(t.items, [p, a]);

    eq(Check(t, ["1", ["1"]]), true);
    // this looks like a Typebox error; `a` / last position is optional
    eq(Check(t, ["1"]), false);
    eq(Check(t, [""]), false);
    eq(Check(t, []), false);
    eq(Check(t, 1), false);
    eq(Check(t, [1]), false);
  },
}));

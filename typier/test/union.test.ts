import { describe } from "~testing";
import { Check } from "typebox/value";

import { Str } from "../src/atoms/index";
import { Uni, Arr } from "../src/compounds/index";

describe(Uni, ({ eq }) => ({
  empty: () => {
    const t = Uni([])("", "?");
    eq(t.$TYP, "");
    eq(t.$KEY, "");
    eq(t["~optional"], true);
    eq(Check(t, []), false);
    eq(Check(t, {}), false);
    eq(Check(t, [1]), false);
    eq(Check(t, 1), false);
  },
  pair: () => {
    const p = Str({ minLength: 1 })("1");
    const a = Arr(p, { minItems: 1 })("1", "?");
    const t = Uni([p, a])("2");
    eq(t.$TYP, "2");
    eq(t.$KEY, "2");
    eq(t.anyOf, [p, a]);

    eq(Check(t, "1"), true);
    eq(Check(t, ["1"]), true);

    eq(Check(t, [""]), false);
    eq(Check(t, []), false);
    eq(Check(t, 1), false);
    eq(Check(t, [1]), false);
  },
}));

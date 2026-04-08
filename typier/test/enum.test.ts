import { describe } from "~testing";
import { Object } from "typebox";
import { Check } from "typebox/value";

import { Enum } from "../src/atoms/enum";

describe(Enum, ({ eq }) => ({
  empty: () => {
    const e = Enum([])("");
    eq(e.Tag, "");
    eq(e.Key, "");
    eq(Check(e, void 0), false);
    eq(Check(Object({ "": e }), {}), false);
    eq(Check(Object({ "": e }), { "": void 0 }), false);
  },
  one: () => {
    const e = Enum([1], { default: 1 })("one", "?");
    eq(e.Tag, "one");
    eq(e.Key, "one");
    eq(e["~optional"], true);
    eq(Check(e, 1), true);
    eq(Check(Object({ one: e }, {}), true));
    eq(Check(e, void 0), false);
  },
  two: () => {
    const e = Enum([1, "2"])("12").$("?one2");
    eq(e.Tag, "12");
    eq(e.Key, "one2");
    eq(e["~optional"], true);
    eq(Check(e, 1), true);
    eq(Check(e, "2"), true);
    eq(Check(Object({ two: e }, {}), true));
    eq(Check(e, "1"), false);
    eq(Check(e, 2), false);
    eq(Check(e, void 0), false);
  },
}));

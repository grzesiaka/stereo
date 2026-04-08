// oxlint-disable no-undef
import { describe } from "~testing";
import { Check } from "typebox/value";

import { Num } from "../src/atoms/index";

describe(Num, ({ eq }) => ({
  empty_schema: () => {
    const n = Num()("num");
    eq(n.Tag, "num");
    eq(n.Key, n.Tag);
    eq(Check(n, 0), true);
    eq(Check(n, ""), false);

    const emptyKey = n.$("");
    eq(emptyKey.Tag, "num");
    eq(emptyKey.Key, "");
    eq(Check(emptyKey, 0), true);
    eq(Check(emptyKey, ""), false);

    const emptyOptionalKey = n.$("?");
    eq(emptyOptionalKey.Tag, "num");
    eq(emptyOptionalKey.Key, "num");
    eq(Check(emptyOptionalKey, 0), true);
    eq(Check(emptyOptionalKey, ""), false);

    const reKey = n.$("k");
    eq(reKey.Tag, "num");
    eq(reKey.Key, "k");
    eq(Check(reKey, 0), true);
    eq(Check(reKey, ""), false);

    const reKeyO = n.$("?k");
    eq(reKeyO.Tag, "num");
    eq(reKeyO.Key, "k");
    eq(Check(reKeyO, 0), true);
    eq(Check(reKeyO, ""), false);
  },

  min_max: () => {
    const n = Num({ minimum: 0, maximum: 10, multipleOf: 2 })("num");
    eq(n.Tag, "num");
    eq(n.Key, n.Tag);
    eq(Check(n, 0), true);
    eq(Check(n, 4), true);
    eq(Check(n, 7), false);
    eq(Check(n, 11), false);
    eq(Check(n, ""), false);
  },

  min_max_exclusive: () => {
    const n = Num({ exclusiveMinimum: 0, exclusiveMaximum: 10, multipleOf: 3 })("num");
    eq(n.Tag, "num");
    eq(n.Key, n.Tag);
    eq(Check(n, 3), true);
    eq(Check(n, 6), true);
    eq(Check(n, 0), false);
    eq(Check(n, 4), false);
    eq(Check(n, 7), false);
    eq(Check(n, 11), false);
    eq(Check(n, ""), false);
  },
}));

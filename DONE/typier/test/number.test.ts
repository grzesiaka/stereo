import { describe } from "~testing";
import { Check } from "typebox/value";

import { Num, Int } from "../src/atoms/index";

describe(Num, ({ eq }) => ({
  empty_schema: () => {
    const n = Num()("num");
    eq(n.$TYP, "num");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, 0), true);
    eq(Check(n, ""), false);

    const emptyKey = n.$("");
    eq(emptyKey.$TYP, "num");
    eq(emptyKey.$KEY, "");
    eq(Check(emptyKey, 0), true);
    eq(Check(emptyKey, ""), false);

    const emptyOptionalKey = n.$("?");
    eq(emptyOptionalKey.$TYP, "num");
    eq(emptyOptionalKey.$KEY, "num");
    eq(Check(emptyOptionalKey, 0), true);
    eq(Check(emptyOptionalKey, ""), false);

    const reKey = n.$("k");
    eq(reKey.$TYP, "num");
    eq(reKey.$KEY, "k");
    eq(Check(reKey, 0), true);
    eq(Check(reKey, ""), false);

    const reKeyO = n.$("?k");
    eq(reKeyO.$TYP, "num");
    eq(reKeyO.$KEY, "k");
    eq(Check(reKeyO, 0), true);
    eq(Check(reKeyO, ""), false);
  },

  min_max: () => {
    const n = Num({ minimum: 0, maximum: 10, multipleOf: 2 })("num");
    eq(n.$TYP, "num");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, 0), true);
    eq(Check(n, 4), true);
    eq(Check(n, 7), false);
    eq(Check(n, 11), false);
    eq(Check(n, ""), false);
  },

  min_max_exclusive: () => {
    const n = Num({ exclusiveMinimum: 0, exclusiveMaximum: 10, multipleOf: 3 })("num");
    eq(n.$TYP, "num");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, 3), true);
    eq(Check(n, 6), true);
    eq(Check(n, 0), false);
    eq(Check(n, 4), false);
    eq(Check(n, 7), false);
    eq(Check(n, 11), false);
    eq(Check(n, ""), false);
  },
}));

describe(Int, ({ eq }) => ({
  empty_schema: () => {
    const n = Int()("num");
    eq(n.$TYP, "num");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, 0), true);
    eq(Check(n, ""), false);

    const emptyKey = n.$("");
    eq(emptyKey.$TYP, "num");
    eq(emptyKey.$KEY, "");
    eq(Check(emptyKey, 0), true);
    eq(Check(emptyKey, ""), false);

    const emptyOptionalKey = n.$("?");
    eq(emptyOptionalKey.$TYP, "num");
    eq(emptyOptionalKey.$KEY, "num");
    eq(Check(emptyOptionalKey, 0), true);
    eq(Check(emptyOptionalKey, ""), false);

    const reKey = n.$("k");
    eq(reKey.$TYP, "num");
    eq(reKey.$KEY, "k");
    eq(Check(reKey, 0), true);
    eq(Check(reKey, ""), false);

    const reKeyO = n.$("?k");
    eq(reKeyO.$TYP, "num");
    eq(reKeyO.$KEY, "k");
    eq(Check(reKeyO, 0), true);
    eq(Check(reKeyO, ""), false);
  },

  min_max: () => {
    const n = Int({ minimum: 0, maximum: 10, multipleOf: 2 })("num");
    eq(n.$TYP, "num");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, 0), true);
    eq(Check(n, 4), true);
    eq(Check(n, 7), false);
    eq(Check(n, 11), false);
    eq(Check(n, ""), false);
  },

  min_max_exclusive: () => {
    const n = Int({ exclusiveMinimum: 0, exclusiveMaximum: 10, multipleOf: 3 })("num");
    eq(n.$TYP, "num");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, 3), true);
    eq(Check(n, 6), true);
    eq(Check(n, 0), false);
    eq(Check(n, 3.000001), false);
    eq(Check(n, 4), false);
    eq(Check(n, 7), false);
    eq(Check(n, 11), false);
    eq(Check(n, ""), false);
  },
}));

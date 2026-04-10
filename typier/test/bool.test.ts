import { describe } from "~testing";
import { Check } from "typebox/value";

import { Bool } from "../src/atoms/index";

describe(Bool, ({ eq }) => ({
  bool: () => {
    const n = Bool()("bool");
    eq(n.$TYP, "bool");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, true), true);
    eq(Check(n, ""), false);

    const emptyKey = n.$("");
    eq(emptyKey.$TYP, "bool");
    eq(emptyKey.$KEY, "");
    eq(Check(emptyKey, false), true);
    eq(Check(emptyKey, ""), false);

    const emptyOptionalKey = n.$("?");
    eq(emptyOptionalKey.$TYP, "bool");
    eq(emptyOptionalKey.$KEY, "bool");
    eq(Check(emptyOptionalKey, true), true);
    eq(Check(emptyOptionalKey, ""), false);

    const reKey = n.$("k");
    eq(reKey.$TYP, "bool");
    eq(reKey.$KEY, "k");
    eq(Check(reKey, false), true);
    eq(Check(reKey, ""), false);

    const reKeyO = n.$("?k");
    eq(reKeyO.$TYP, "bool");
    eq(reKeyO.$KEY, "k");
    eq(Check(reKeyO, true), true);
    eq(Check(reKeyO, ""), false);
  },
}));

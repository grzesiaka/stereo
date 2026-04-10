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

    const emptyKey = n.$("rekeyed");
    eq(emptyKey.$TYP, "bool");
    eq(emptyKey.$KEY, "rekeyed");
    eq(Check(emptyKey, false), true);
    eq(Check(emptyKey, ""), false);

    const emptyOptionalKey = emptyKey.$("?");
    eq(emptyOptionalKey.$TYP, "bool");
    eq(emptyOptionalKey.$KEY, "rekeyed");
    eq(emptyOptionalKey["~optional"], true);
    eq(Check(emptyOptionalKey, true), true);
    eq(Check(emptyOptionalKey, ""), false);

    const reKey = n.$("k");
    eq(reKey.$TYP, "bool");
    eq(reKey.$KEY, "k");
    eq(Check(reKey, false), true);
    eq(Check(reKey, ""), false);

    const reKeyO = reKey.$("?");
    eq(reKeyO.$TYP, "bool");
    eq(reKeyO.$KEY, "k");
    eq(Check(reKeyO, true), true);
    eq(Check(reKeyO, ""), false);

    const reKey1 = reKey.$("?k");
    eq(reKey1.$TYP, "bool");
    eq(reKey1.$KEY, "k");
    eq(Check(reKey1, true), true);
    eq(Check(reKey1, ""), false);

    const reKey2 = reKey.$("?kk");
    eq(reKey2.$TYP, "bool");
    eq(reKey2.$KEY, "kk");
    eq(Check(reKey2, true), true);
    eq(Check(reKey2, ""), false);
  },
}));

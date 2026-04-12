import { describe } from "~testing";
import { Check } from "typebox/value";

import { Const } from "../src/atoms/index";

describe(Const, ({ eq }) => ({
  num: () => {
    const k = Const(0)("0");
    eq(k.$TYP, "0");
    eq(k.$KEY, "0");
    eq(Check(k, 0), true);
    eq(Check(k, 1), false);
    eq(Check(k, ""), false);
  },
  string: () => {
    const k = Const("")("", "empty");
    eq(k.$TYP, "");
    eq(k.$KEY, "empty");
    eq(Check(k, ""), true);
    eq(Check(k, "0"), false);
    eq(Check(k, 0), false);
  },
  boolean: () => {
    const k = Const(true)("T", "F");
    eq(k.$TYP, "T");
    eq(k.$KEY, "F");
    eq(Check(k, true), true);
    eq(Check(k, false), false);
    eq(Check(k, 0), false);
  },
}));

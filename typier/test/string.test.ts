// oxlint-disable no-undef
import { describe } from "~testing";
import { Check } from "typebox/value";

import { Str } from "../src/atoms/index";

describe(Str, ({ eq }) => ({
  empty_schema: () => {
    const n = Str()("str", "?");
    eq(n.$TYP, "str");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, ""), true);
    eq(Check(n, 0), false);

    const emptyKey = n.$("");
    eq(emptyKey.$TYP, "str");
    eq(emptyKey.$KEY, "");
    eq(Check(emptyKey, ""), true);
    eq(Check(emptyKey, 0), false);

    const emptyOptionalKey = n.$("?");
    eq(emptyOptionalKey.$TYP, "str");
    eq(emptyOptionalKey.$KEY, "str");
    eq(Check(emptyOptionalKey, ""), true);
    eq(Check(emptyOptionalKey, 0), false);

    const reKey = n.$("k");
    eq(reKey.$TYP, "str");
    eq(reKey.$KEY, "k");
    eq(Check(reKey, ""), true);
    eq(Check(reKey, 0), false);

    const reKeyO = n.$("?k");
    eq(reKeyO.$TYP, "str");
    eq(reKeyO.$KEY, "k");
    eq(Check(reKeyO, ""), true);
    eq(Check(reKeyO, 0), false);
  },

  min_max_length: () => {
    const n = Str({ minLength: 2, maxLength: 4 })("str");
    eq(n.$TYP, "str");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, "22"), true);
    eq(Check(n, 0), false);
    eq(Check(n, ""), false);
    eq(Check(n, "55555"), false);
  },

  pattern: () => {
    const n = Str({ pattern: "abc" })("str");
    eq(n.$TYP, "str");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, "abc"), true);
    eq(Check(n, "ZabcZ"), true);
    eq(Check(n, ""), false);
    eq(Check(n, "ab c"), false);
  },

  format: () => {
    const n = Str({ format: "date" })("str");
    eq(n.$TYP, "str");
    eq(n.$KEY, n.$TYP);
    eq(Check(n, "2026-04-08"), true);
    eq(Check(n, "0000-12-31"), true);
    eq(Check(n, ""), false);
    eq(Check(n, "ab c"), false);
  },

  default: () => {
    const n = Str("def")("str");
    eq(n.$TYP, "str");
    eq(n.$KEY, n.$TYP);
    eq(n.default, "def");
  },
}));

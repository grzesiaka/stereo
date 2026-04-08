// oxlint-disable no-undef
import { describe } from "~testing";
import { Check } from "typebox/value";

import { Str } from "../src/atoms/index";

describe(Str, ({ eq }) => ({
  empty_schema: () => {
    const n = Str()("str", "?");
    eq(n.Tag, "str");
    eq(n.Key, n.Tag);
    eq(Check(n, ""), true);
    eq(Check(n, 0), false);

    const emptyKey = n.$("");
    eq(emptyKey.Tag, "str");
    eq(emptyKey.Key, "");
    eq(Check(emptyKey, ""), true);
    eq(Check(emptyKey, 0), false);

    const emptyOptionalKey = n.$("?");
    eq(emptyOptionalKey.Tag, "str");
    eq(emptyOptionalKey.Key, "str");
    eq(Check(emptyOptionalKey, ""), true);
    eq(Check(emptyOptionalKey, 0), false);

    const reKey = n.$("k");
    eq(reKey.Tag, "str");
    eq(reKey.Key, "k");
    eq(Check(reKey, ""), true);
    eq(Check(reKey, 0), false);

    const reKeyO = n.$("?k");
    eq(reKeyO.Tag, "str");
    eq(reKeyO.Key, "k");
    eq(Check(reKeyO, ""), true);
    eq(Check(reKeyO, 0), false);
  },

  min_max_length: () => {
    const n = Str({ minLength: 2, maxLength: 4 })("str");
    eq(n.Tag, "str");
    eq(n.Key, n.Tag);
    eq(Check(n, "22"), true);
    eq(Check(n, 0), false);
    eq(Check(n, ""), false);
    eq(Check(n, "55555"), false);
  },

  pattern: () => {
    const n = Str({ pattern: "abc" })("str");
    eq(n.Tag, "str");
    eq(n.Key, n.Tag);
    eq(Check(n, "abc"), true);
    eq(Check(n, "ZabcZ"), true);
    eq(Check(n, ""), false);
    eq(Check(n, "ab c"), false);
  },

  format: () => {
    const n = Str({ format: "date" })("str");
    eq(n.Tag, "str");
    eq(n.Key, n.Tag);
    eq(Check(n, "2026-04-08"), true);
    eq(Check(n, "0000-12-31"), true);
    eq(Check(n, ""), false);
    eq(Check(n, "ab c"), false);
  },
}));

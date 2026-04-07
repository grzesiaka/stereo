// oxlint-disable no-undef
import { describe } from "~testing";
import { Check } from "typebox/value";
import { Static, Number, Unsafe } from "typebox";

import { Num } from "../src/atoms/index";

describe(Num, ({ eq }) => ({
  0: () => {
    const n = Num({ minimum: 0, multipleOf: 1 })("abc");
    const m = Unsafe<string & { abc: 1 }>(Number());
    console.log(m, m["~hint"], m["~kind"], m["~kind"]);
    type M = Static<typeof m>;
    type N = Static<typeof n>;
    eq(Check(n, 0), true);
  },
}));

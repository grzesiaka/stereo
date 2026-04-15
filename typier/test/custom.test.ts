import { describe } from "~testing";
import { Check } from "typebox/value";
import { Refine, Number } from "typebox";

const r = Refine(Number(), () => false);
r["~refine"];

import { Custom } from "../src";

describe(Custom, ({ eq }) => ({
  UInt8Array: () => {
    const t = Custom((x: Uint8Array) => x instanceof Uint8Array)("UInt8[]");
    console.log(t);
    eq(Check(t, 1), false);

    // eq(Check(r, 0), false);
  },
}));

import { describe } from "~testing";
import { Decode, Check } from "typebox/value";

import { UNSAFE } from "../src";

describe(UNSAFE, ({ eq }) => ({
  Uint8Array_or_Array: () => {
    const codec = UNSAFE<Array<number> | Uint8Array>(
      (a) => (a instanceof Uint8Array ? a : new Uint8Array(a)) as Uint8Array,
      (a) => a,
    )("Uint8Array");

    eq(Decode(codec, [0, 0, 255]), new Uint8Array([0, 0, 255]) as never);
    eq(Decode(codec, new Uint8Array([0, 0, 255])), new Uint8Array([0, 0, 255]) as never);

    eq(Check(codec, [-1, 0, 256]), true);

    // TODO - this is problematic; typebox does not offer custom validation logic as such
    const a = [-1, 0, 256];
    if (Check(codec, a)) {
      const _b = a;
    }
    const s = "";
    if (Check(codec, s)) {
      const _s = s;
    }

    eq(Check(codec, ""), true);
  },
}));

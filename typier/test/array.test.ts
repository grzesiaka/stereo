import { describe } from "~testing";
import { Check } from "typebox/value";

import { Num, Str, Enum } from "../src/atoms/index";
import { Arr, Obj } from "../src/compounds/index";

describe(Arr, ({ eq }) => ({
  primitive: () => {
    const p = Str({ minLength: 1 })("1");
    const a = Arr(p, { minItems: 1 })("1", "?");
    eq(a.$TYP, "1");
    eq(a.$KEY, "1");
    eq(a["~optional"], true);
    eq(a.items, p);
    eq(Check(a, ["1"]), true);
    eq(Check(a, ["1", "22"]), true);
    eq(Check(a, [""]), false);
    eq(Check(a, []), false);
    eq(Check(a, 1), false);
    eq(Check(a, [1]), false);
    // type _O = Static<typeof o>;
  },

  nested_object: () => {
    const p = [Str()("S"), Num()("N"), Enum([0, 1])("E")] as const;
    const s = Obj.$(p);
    const o = Obj(s("R"), s("O", "?"))("obj");
    const a = Arr(o)("nested", "yo");

    eq(a.$TYP, "nested");
    eq(a.$KEY, "yo");
    eq(a.items, o);

    eq(Check(a, [{ R: { S: "", N: 0, E: 1 } }]), true);
    eq(Check(a, [{ R: { S: "", N: 0, E: 1 }, O: { S: "", N: 0, E: 1 } }]), true);

    eq(Check(a, [{ R: { S: "", N: 0, E: 1 }, O: {} }]), false);
    eq(Check(a, [{}]), false);
    eq(Check(a, 1), false);
  },
}));

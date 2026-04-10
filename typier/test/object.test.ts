import { describe } from "~testing";
import { Check } from "typebox/value";

import { Num, Str, Enum } from "../src/atoms/index";
import { Obj } from "../src/compounds/object";

describe(Obj, ({ eq }) => ({
  empty: () => {
    const o = Obj([])("");
    eq(o.$TYP, "");
    eq(o.$KEY, "");
    eq(o.$PARTS, []);
    eq(Check(o, {}), true);
    // type _O = Static<typeof o>;
  },
  one: () => {
    const p = [Str("")("1")] as const;
    const o = Obj(p)("1", "?");
    eq(o.$TYP, "1");
    eq(o.$KEY, "1");
    eq(o.$PARTS, p);
    eq(Check(o, { "1": "" }), true);
    eq(Check(o, {}), false);
    eq(Check(o, { "1": void 0 }), false);
    eq(Check(o, { "1": 1 }), false);
    // type _O = Static<typeof o>;
  },
  one_optional: () => {
    const p = [Str("")("1", "?")] as const;
    const o = Obj(p)("1", "?");
    eq(o.$TYP, "1");
    eq(o.$KEY, "1");
    eq(o.$PARTS, p);
    eq(Check(o, { "1": "" }), true);
    eq(Check(o, {}), true);
    eq(Check(o, { "1": void 0 }), true);
    eq(Check(o, { "1": 1 }), false);
    // type _O = Static<typeof o>;
  },
  nested: () => {
    const p = [Str()("S"), Num()("N"), Enum([0, 1])("E")] as const;
    const s = Obj(p);
    const o = Obj([s("R"), s("O", "?")])("nested");

    eq(o.$TYP, "nested");
    eq(o.$KEY, "nested");

    eq(Check(o, { R: { S: "", N: 0, E: 1 } }), true);
    eq(Check(o, { R: { S: "", N: 0, E: 1 }, O: { S: "", N: 0, E: 1 } }), true);

    eq(Check(o, { R: { S: "", N: 0, E: 1 }, O: {} }), false);
    eq(Check(o, {}), false);

    // type _O = Static<typeof o>;
  },
}));

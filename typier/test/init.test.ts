import { Check } from "typebox/value";

import { describe } from "~testing";
import { fromTree, Num, Obj, Str } from "../src/index";

describe(fromTree, ({ eq }) => ({
  empty: () => {
    eq(fromTree({}), {});
  },
  flat: () => {
    const s = Str({ minLength: 2 });
    const t = fromTree({ type_key: s });
    eq(t.type_key.$TYP, "type_key");
    eq(t.type_key.$KEY, "type_key");
    eq(t.type_key.minLength, 2);
  },
  nested: () => {
    const t = fromTree({ "0": { type: { key: Str({ minLength: 2 }), obj: Obj(Str()("name"), Num()("age")) } } });
    eq(t["0"].type.key.$TYP, "0.type.key");
    eq(t["0"].type.key.$KEY, "key");
    eq(t["0"].type.key.minLength, 2);
    eq(t["0"].type.obj.$TYP, "0.type.obj");
    eq(t["0"].type.obj.$KEY, "obj");
    eq(Check(t["0"].type.obj, {}))(false);
    eq(Check(t["0"].type.obj, { name: "", age: 0 }))(true);
  },
}));

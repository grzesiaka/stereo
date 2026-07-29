import { Check, Parse } from "typebox/value";

import { describe } from "~testing";
import { reTYP$, fromTree, Num, Obj, Str, WithTag } from "../src/index";

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

describe(reTYP$, ({ eq }) => {
  const S = Str()("str");
  const N = Num()("num");
  const O = Obj(S, N)("obj");
  const t = { s: S, n: { n: N, o: O }, o: O } as const;
  return {
    empty: () => {
      eq(reTYP$({}), {});
    },
    tree: () => {
      const r = reTYP$(t);
      eq(Parse(r.n.n, 1), 1 as WithTag<number, "n.n">);
      eq(r.n.n.$TYP, "n.n");
      eq(r.n.n.$KEY, "num");
      eq(r.n.o.$TYP, "n.o");
      eq(r.n.o.$KEY, "obj");
      eq(r.o.$TYP, "o");
    },

    prefix: () => {
      const r = reTYP$.prefix("$")(t);
      eq(Parse(r.s, ""), "" as WithTag<string, "$.s">);
      eq(r.s.$TYP, "$.s");
      eq(r.s.$KEY, "str");
      eq(r.n.n.$TYP, "$.n.n");
      eq(r.n.n.$KEY, "num");
    },
  };
});

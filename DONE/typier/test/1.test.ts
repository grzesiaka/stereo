import { Check, Parse } from "typebox/value";

import { describe } from "~testing";

import { B, C, E, N, S, A, O, T, U } from "../src/1";
import { fromTree } from "../src";
import { Tagged, WithTag } from "~types";

const $ = fromTree({
  num: N({}), // options not present in intellisense
  str: S({ format: "email" }),
  ok: B(),
  konst: C("konst"),
  yes_or_no: E(["yes", "no"]),
  arr: A(S({ minLength: 2 })("array")),
  tup: T(N()("num"), S({ minLength: 2 })("str")),
  union: U(S()("union")),
  obj: O(S()("abc")),
});

const $schema = O($.num, $.str, $.ok, $.konst, $.yes_or_no, $.arr, $.tup, $.union, $.obj);
const schema = $schema("test");
const value = {
  num: 0,
  str: "abc@abc.com",
  ok: true,
  konst: "konst",
  yes_or_no: "yes",
  arr: ["22"],
  tup: [0, "22"],
  union: "",
  obj: {
    abc: "",
  },
} as unknown;

describe("single letters", ({ eq }) => ({
  complex: () => {
    eq(Check(schema, {}), false);
    eq(Check(schema, value), true);
    const x = Parse(schema, value);
    eq(x)(
      value as {
        num: WithTag<number, "num">;
        str: Tagged<string, "str", "<email>">;
        ok: WithTag<boolean, "ok">;
        konst: WithTag<"konst", "konst">;
        yes_or_no: Tagged<"yes" | "no", "yes_or_no", "<enum>">;
        arr: Tagged<string, "array", "2<=length">[];
        tup: [WithTag<number, "num">, Tagged<string, "str", "2<=length">];
        union: WithTag<string, "union">;
        obj: {
          abc: WithTag<string, "abc">;
        };
      },
    );
  },
}));

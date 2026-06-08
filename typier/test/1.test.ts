import { Check } from "typebox/value";

import { describe } from "~testing";

import { B, C, E, N, S, A, O, T, U } from "../src/1";
import { fromTree } from "../src";

const R = fromTree({
  num: N({}),
  str: S({ format: "email" }),
  ok: B(),
  konst: C("konst"),
  yes_or_no: E(["yes", "no"]),
  arr: A(S({ minLength: 2 })),
  tup: T([N()("")]),
  union: U(S()),
  obj: O(S()("abc")),
});

const $ = O(R.num, R.str, R.ok, R.konst, R.yes_or_no, R.arr, R.tup, R.union, R.obj)("");
const ok = {
  num: 0,
  str: "abc@abc.com",
  ok: true,
  konst: "konst",
  yes_or_no: "yes",
  arr: ["22"],
  tup: [0],
  union: "",
  obj: {
    abc: "",
  },
};

describe("single letters", ({ eq }) => ({
  complex: () => {
    eq(Check($, {}), false);
    eq(Check($, ok), true);
  },
}));

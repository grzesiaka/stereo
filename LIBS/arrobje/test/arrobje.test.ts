import { describe } from "~testing";
import { __, a } from "jsyoyo";

import AO from "../src";

const ex = [
  { id: "A", v: "a" },
  {},
  { id: "B", v: "b" },
  { id: "no-v" },
  { id: "C", v: "c" },
  { v: "no-id" },
  {},
] as const;

describe(AO, ({ eq }) => ({
  empty: () => {
    const x = AO([]);
    const r = a([] as [], { $: {} });
    eq(x, r);
  },

  ex: () => {
    const x = AO.$("id", "v")(ex);
    const _r = ["a", __, "b", __, "c", "no-id", __] as const;
    const r = a(_r, { $: { A: "a", B: "b", "no-v": __, C: "c" } } as const);
    eq(x, r as typeof x);
  },

  ex_no_anchor: () => {
    const x = AO.$("id", "v", null)(ex);
    const _r = ["a", __, "b", __, "c", "no-id", __] as const;
    eq([...x], _r);
    eq(x.A, "a");
    eq(x.B, "b");
    eq(x.C, "c");
    eq(x["no-v"], __);
  },

  abc: () => {
    eq(
      AO.$(
        "key",
        "value",
        "__",
      )([
        { key: "A", value: "a" },
        { key: "B", value: "b" },
        { key: "C", value: "c" },
      ]),
      a(["a", "b", "c"] as ["a", "b", "c"], { __: { A: "a", B: "b", C: "c" } } as const),
    );
  },
}));

import { describe } from "~testing";
import { join, split, extractPrefix, groupByPrefix, PrePrefix } from "../src";

describe(join, ({ eq }) => ({
  empty_empty: () => {
    eq(join("")([]), "");
    eq(join(" ")([]), "");
    eq(join("!!")([]), "");
  },
  single: () => {
    eq(join("")([1]), "1");
    eq(join(" ")([1]), "1");
    eq(join("!!")([1]), "1");
  },
  pair: () => {
    eq(join("")([1, "2"]), "12");
    eq(join(" ")([1, "2"]), "1 2");
    eq(join("!!")([1, "2"]), "1!!2");
  },
  arr: () => {
    eq(join("")([1, "2"] as string[]), "12");
    eq(join(" ")([1, "2"] as string[]), "1 2");
    eq(join("!!")([1, "2"] as string[]), "1!!2");
  },
}));

describe(split, ({ eq }) => ({
  empty: () => {
    const $ = split("");
    eq($(""), []);
    eq($(" "), [" "]);
    eq($("  "), [" ", " "]);
    eq($("123"), ["1", "2", "3"]);
  },
  space: () => {
    const $ = split(" ");
    eq($(""), [""]);
    eq($(" "), ["", ""]);
    eq($("  "), ["", "", ""]);
    eq($("1 2 3"), ["1", "2", "3"]);
  },
}));

describe(extractPrefix, ({ eq }) => {
  return {
    with_empty: () => {
      const ps = ["a.", "aa", "a", ""] as const;
      const ex = extractPrefix(...ps);
      eq(ex(""), "");
      eq(ex("aa"), "aa");
      eq(ex("aab"), "aa");
      eq(ex(".aa"), "");
      eq(ex("AA"), "");

      eq(ex("a."), "a.");
      eq(ex("a.b"), "a.");
      eq(ex("A."), "");
    },
    no_empty: () => {
      const ps = ["a.", "aa", "a"] as const;
      const ex = extractPrefix(...ps);
      eq(ex(""), void 0);
      eq(ex("aa"), "aa");
      eq(ex("aab"), "aa");
      eq(ex(".aa"), void 0);
      eq(ex("AA"), void 0);

      eq(ex("a."), "a.");
      eq(ex("a.b"), "a.");
      eq(ex("A."), void 0);
    },
  };
});

describe(groupByPrefix, ({ eq }) => {
  return {
    empty: () => {
      eq(groupByPrefix("k")()([]), {});
      eq(groupByPrefix("k")("a")([]), {});
    },
    simple: () => {
      const items = [{ type: "a.a" }, { type: "a.b" }, { type: "b.a" }, { type: "b.b" }] as const;
      type Items = typeof items;
      type P = PrePrefix<"type", ["a"], Items>;
      const g = groupByPrefix("type")("a")(items);
      eq(g, { a: [items[0], items[1]] });
    },
  };
});

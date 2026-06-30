import { describe } from "~testing";
import { join } from "../src/index";
import { split } from "../src/index";

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

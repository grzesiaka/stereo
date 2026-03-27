import { describe } from "~testing";
import { Tagged } from "~types";

import sum from "../src/base/sum";
import add from "../src/base/add";
import subtract from "../src/base/subtract";
import product from "../src/base/product";
import multiply from "../src/base/multiply";

const t = <const X, T extends PropertyKey = "num">(x: X, _ = "num" as T) => x as Tagged<X, T>;

describe(sum, ({ eq }) => ({
  0: () => eq(sum([]), 0),
  1: () => eq(sum([1]), 1),
  2: () => eq(sum([1, 1]), 2),
  4: () => eq(sum([2, 2, 2, 2]), 8),
  // oxlint-disable-next-line typescript/prefer-as-const
  "0.1+0.2=0.3": () => eq(sum([0.1, 0.2]), 0.30000000000000004 as 0.3),
  "number[]": () => eq(sum([1, 1] as number[]), 2),
}));

describe("sum/tagged", ({ eq }) => ({
  1: () => eq(sum([t(1)]), t(1)),
  2: () => eq(sum([t(1), t(1)]), t(2)),
  4: () => eq(sum([t(2), t(2), 2, 2]), t(8)),
  // all tags are collected - probably not ideal for summing, but could be beneficial when parsing
  multi_tagged: () => eq(sum([t(1, "1"), t(2, "2"), t(3, "3")]), t<6, "1" | "2" | "3">(6)),
  "Tagged<number, 'num'>[]": () => eq(sum([t<number>(1), 1]), t(2)),
  "Tagged<number, 'num' | 'other'>[]": () => eq(sum([t<number>(1), t(1, "other")]), t<number, "num" | "other">(2)),
}));

describe(add, ({ eq }) => ({
  "1+1=2": () => eq(add(1, 1), 2),
  "tagged+untagged=tagged": () => eq(add(t(2), 2), t(4)),
  "tagged+tagged=tagged": () => eq(add(t(2), t(2)), t(4)),
}));

describe(subtract, ({ eq }) => ({
  "1-1=0": () => eq(subtract(1, 1), 0),
  "1-2=-1": () => eq(subtract(1, 2), -1),
  "1-(-2)=3": () => eq(subtract(1, -2), 3),
  tagged: () => eq(subtract(t(5), t(2.3)), t(2.7)),
}));

describe(product, ({ eq }) => ({
  0: () => eq(product([]), 1),
  1: () => eq(product([2]), 2),
  2: () => eq(product([2, 2]), 4),
  4: () => eq(product([4, 4, 4, 4]), 256),
  "number[]": () => eq(product([4 as number, 4, 4, 4]), 256),
}));

describe("product/tagged", ({ eq }) => ({
  1: () => eq(product([t(2)]), t(2)),
  2: () => eq(product([t(2), t(2)]), t(4)),
  4: () => eq(product([t(4), 4, 4, 4]), t(256)),
  multi_tagged: () => eq(product([t(1, "1"), t(2, "2"), t(3, "3")]), t<6, "1" | "2" | "3">(6)),
  "Tagged<number, 'num'>[]": () => eq(product([t<number>(1), 1]), t(1)),
  "Tagged<number, 'num' | 'other'>[]": () => eq(product([t<number>(2), t(5, "other")]), t<number, "num" | "other">(10)),
}));

describe(multiply, ({ eq }) => ({
  "2x2=4": () => eq(multiply(2, 2), 4),
  "tagged+untagged=tagged": () => eq(multiply(t(2), 2), t(4)),
  "tagged+tagged=tagged": () => eq(multiply(t(2), t(2)), t(4)),
}));

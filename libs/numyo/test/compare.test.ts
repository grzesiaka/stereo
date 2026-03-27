import { describe } from "~testing";
import { Tagged } from "~types";

import min from "../src/compare/min";
import max from "../src/compare/max";

const t = <const X, T extends PropertyKey = "num">(x: X, _ = "num" as T) => x as Tagged<X, T>;

describe(min, ({ eq }) => ({
  0: () => {
    eq(min([]), Infinity);
    eq(min([], 0), 0);
  },
  1: () => {
    eq(min([0]), 0);
    eq(min([1]), 1);
  },
  2: () => {
    eq(min([0, 1]), 0);
    eq(min([1, 0]), 0);
  },
  3: () => {
    eq(min([0, 1, 2]), 0);
    eq(min([2, 0, -1]), -1);
  },
  "number[]": () => {
    eq(min([0 as number, 1, 2]), 0);
    eq(min([2, 0, -1 as number]), -1);
  },
}));

describe(`min/tagged`, ({ eq }) => ({
  1: () => {
    eq(min([t(0)]), t(0));
    eq(min([t(1)], 1), t(1));
  },
  2: () => {
    eq(min([t(0), t(1)]), t(0));
    eq(min([t(1), 0]), t(0)); // tags are collected from all entries
  },
  3: () => {
    eq(min([t(1, 1), t(0, 0), t(2, 2)]), t<0, 0 | 1 | 2>(0));
    eq(min([t(2), t(0), t(-1)]), t(-1));
  },
  "tagged_number[]": () => {
    eq(min([0 as number, t(1), 2]), t(0));
    eq(min([t(2), 0, -1 as number]), t(-1));
  },
}));

describe(max, ({ eq }) => ({
  0: () => {
    eq(max([]), Infinity);
    eq(max([], 0), 0);
  },
  1: () => {
    eq(max([0]), 0);
    eq(max([1]), 1);
  },
  2: () => {
    eq(max([0, 1]), 1);
    eq(max([1, 0]), 1);
  },
  3: () => {
    eq(max([0, 1, 2]), 2);
    eq(max([2, 0, -1]), 2);
  },
  "number[]": () => {
    eq(max([0 as number, 1, 2]), 2);
    eq(max([2, 0, -1 as number]), 2);
  },
}));

describe(`max/tagged`, ({ eq }) => ({
  1: () => {
    eq(max([t(0)]), t(0));
    eq(max([t(1)], 1), t(1));
  },
  2: () => {
    eq(max([t(0), t(1)]), t(1));
    eq(max([t(1), 0]), t(1)); // tags are collected from all entries
  },
  3: () => {
    eq(max([t(1, 1), t(0, 0), t(2, 2)]), t<2, 0 | 1 | 2>(2));
    eq(max([t(2), t(0), t(-1)]), t(2));
  },
  "tagged_number[]": () => {
    eq(max([0 as number, t(1), 2]), t(2));
    eq(max([t(2), 0, -1 as number]), t(2));
  },
}));

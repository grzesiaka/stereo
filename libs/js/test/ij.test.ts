import { describe } from "~testing";
import ij from "../src/ij";

const __ = void 0;

const _123 = [1, 2, 3] as const;
const objs = [
  { id: 0, name: "00" },
  { id: 1, name: "11" },
] as const;

describe(ij, ({ eq }) => ({
  empty: () => eq(ij()(_123), [[], [], []]),

  single: () => eq(ij("id")(objs), [0, 1]),
  single_undefined: () => eq(ij(__)(objs), [...objs]),
  single_no_match: () => eq(ij("id")(_123), [__, __, __]),

  multi: () =>
    eq(ij("id", "name")(objs), [
      [0, "00"],
      [1, "11"],
    ]),
  multi_undefined: () =>
    eq(ij("id", __, "name")(objs), [
      [0, objs[0], "00"],
      [1, objs[1], "11"],
    ]),
  multi_no_match: () =>
    eq(ij("id", "name")(_123), [
      [__, __],
      [__, __],
      [__, __],
    ]),
  multi_no_match_undefined: () =>
    eq(ij("id", __, "name")(_123), [
      [__, 1, __],
      [__, 2, __],
      [__, 3, __],
    ]),
}));

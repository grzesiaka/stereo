import { describe } from "~testing";

import { toObject } from "../out/pairs.mjs";

describe(toObject, ({ eq }) => ({
  empty: () => eq(toObject([]), {}),
  single: () => eq(toObject([["1", 1]]), { 1: 1 }),
  multi: () =>
    eq(
      toObject([
        ["1", 1],
        ["a", "a"],
      ]),
      { a: "a", 1: 1 },
    ),
}));

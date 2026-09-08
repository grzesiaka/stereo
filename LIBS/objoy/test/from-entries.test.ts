import { describe } from "~testing";

import { fromEntries as $ } from "../src";

describe($, ({ eq }) => ({
  empty: () => eq($([]), {}),
  single: () => eq($([["1", 1]]), { 1: 1 }),
  multi: () =>
    eq(
      $([
        ["1", 1],
        ["a", "a"],
      ]),
      { a: "a", 1: 1 },
    ),
}));

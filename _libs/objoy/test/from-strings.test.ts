import { describe } from "~testing";

import { fromStrings } from "../src/from-strings";

describe(fromStrings, ({ eq }) => ({
  empty: () => eq(fromStrings([]), {}),
  single: () => eq({ 1: "1" }, fromStrings(["1"])),
  strings: () => eq(fromStrings(["a", "b"] as string[]))({ a: "a", b: "b" }),
}));

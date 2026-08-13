import { describe } from "~testing";
import { dethunk } from "../src";

describe(dethunk, ({ eq }) => ({
  empty: () => eq([], dethunk([] as readonly [])),
  array: () => eq([1, 2, 3], dethunk([1, (..._: unknown[]) => 2, 3])),
  nested: () => eq([1, [1.5, [1.75, 1.8]], 2, 3], dethunk([1, [1.5, [() => 1.75, 1.8]], (..._: unknown[]) => 2, 3])),
}));

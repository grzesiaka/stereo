import { describe } from "~testing";
import cross from "../src/cross";

describe(cross, ({ eq }) => ({
  empty: () => {
    eq(cross([], 1), []);
    eq(cross([], [1, 2]), []);
    eq(cross(["a", "b"], []), []);
    eq(cross([], []), []);
    eq(cross("a", []), []);
  },

  one_and_one: () => {
    eq(cross(1, 1), [[1, 1]]);
    eq(cross([1], 1), [[1, 1]]);
    eq(cross(1, [1]), [[1, 1]]);
    eq(cross([1], [1]), [[1, 1]]);
  },

  one_and_many: () => {
    eq(cross(1, [1, 2]), [
      [1, 1],
      [1, 2],
    ]);
    eq(cross([1, 2], 1), [
      [1, 1],
      [2, 1],
    ]);
  },

  many_and_many: () => {
    eq(cross(["a", "b"], [1, 2]), [
      ["a", 1],
      ["a", 2],
      ["b", 1],
      ["b", 2],
    ]);
    eq(cross([1, 2], ["a", "b"]), [
      [1, "a"],
      [1, "b"],
      [2, "a"],
      [2, "b"],
    ]);
  },

  array: () => {
    eq(cross([1] as number[], "a"), [[1, "a"]] as [number, "a"][]);
    // @ts-expect-error stricter type infered
    eq(cross([1], "a"), [[1, "a"]] as [number, "a"][]);

    eq(cross([1], ["a"] as "a"[]), [[1, "a"]] as [1, "a"][]);
    // @ts-expect-error stricter type infered
    eq(cross([1], ["a"]), [[1, "a"]] as [1, string][]);

    const a = cross([1] as number[], ["a"] as string[]);
    eq(a, [[1, "a"]] as [number, string][]);
  },
}));

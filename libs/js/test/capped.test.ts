import { describe } from "~testing";
import { capped, type Capped } from "../src/capped";

describe(capped, ({ eq }) => ({
  0: () => {
    const a = capped(0);
    eq(a.cap, 0);
    eq([...a], []);
    eq(a.push(1, 0));
    eq([...a], []);
    eq(capped.isFull(a), true);
  },
  1: () => {
    const a = capped(1);
    eq(a.cap, 1);
    eq([...a], []);
    a.push(1);
    eq([...a], [1]);
    a.push("a");
    eq([...a], ["a"]);
  },
  2: () => {
    const a = capped(2);
    eq([...a], []);
    eq(a.cap, 2);
    eq(a.push(1), 1);
    eq([...a], [1]);
    eq(a.push("a"), 2);
    eq([...a], [1, "a"]);
    eq(a.push("b"), 2);
    eq(a.push(2), 2);
    eq([...a], ["b", 2]);
    eq(a.length, 2);
  },

  no_cap: () => {
    const a = capped();
    eq(a.cap, void 0);
    a.push(1);
    a.push(2);
    eq(a, [1, 2]);
    eq(capped.isFull([]), false);
    eq(capped.isFull(a), false);
    eq(Array.isArray(a), true);
  },

  arr_type_ok: () => {
    const f = <X>(f = [] as unknown as Capped<X>) => f;
    const n = f([1, 2]);
    eq(f(), []);
    eq(f(n), [1, 2]);
  },

  more_than_cap: () => {
    const a = capped(2, "a", "b", "c");
    eq([...a], ["b", "c"]);
    a.push("d");
    eq([...a], ["c", "d"]);
  },
}));

import { describe } from "~testing";

import { input, map, filter, scan, event, tap, flatten, once, take, exe } from "../src/index";
import { id } from "jsyoyo";

describe("base", ({ eq, res }) => ({
  once: () => {
    const r = res();
    const o = once<1>()()(r.add);
    eq(o.__, ["once"]);
    r.eq([]);
    eq(o["#"], 1);
    eq("X" in o, false);
    o.I(1);
    r.eq([1]);
    eq(o["X"], 1);
    o.I(1);
    r.eq([1]);
  },

  input: () => {
    const r = res();
    const i = input(1, "in")()(r.add);

    eq(i.Id, "in");
    r.eq([1]);
    i.I(2);
    r.eq([1, 2]);
  },

  map: () => {
    const r = res();
    const i = input(1)(map((x) => x + x))(r.add);
    r.eq([2]);
    i.Y.I(2);
    r.eq([2, 4]);
  },

  filter: () => {
    const r = res();
    const y = input(1)(
      map((x) => x * x),
      filter((x) => x % 2 === 0),
    );
    const i = y(r.add);
    r.eq([]);
    i.Y.Y.I(2);
    i.Y.Y.I(3);
    i.Y.Y.I(4);
    r.eq([4, 16]);

    const yy = flatten(i).map((x) => x.__[0]);
    eq(yy, ["input", "map", "filter"]);
  },

  scan_seed: () => {
    const r = res();
    const i = input(1)(
      map((x) => x * x),
      scan((acc, x) => acc + x, 0),
      tap(r.add),
    )(id);
    r.eq([1]);
    i.Y.Y.Y.I(2);
    i.Y.Y.Y.I(3);
    i.Y.Y.Y.I(4);
    r.eq([1, 1 + 4, 1 + 4 + 9, 1 + 4 + 9 + 16]);
  },

  scan_no_seed: () => {
    const r = res();
    const i = input(1)(
      map((x) => x * x),
      scan((acc, x) => acc + x),
    )(r.add);
    r.eq([1]);
    i.Y.Y.I(2);
    i.Y.Y.I(3);
    i.Y.Y.I(4);

    r.eq([1, 1 + 4, 1 + 4 + 9, 1 + 4 + 9 + 16]);
  },

  scan_no_seed_event: () => {
    const r = res();
    const i = event<number>()(
      map((x) => x * x),
      scan((acc, x) => acc + x),
    )(r.add);
    r.eq([]);

    i.Y.Y.I(1);
    i.Y.Y.I(2);
    i.Y.Y.I(3);
    i.Y.Y.I(4);
    r.eq([1, 1 + 4, 1 + 4 + 9, 1 + 4 + 9 + 16]);
  },
}));

describe(take, ({ res }) => ({
  0: () => {
    const r = res();
    const i = input("a")(
      take(0),
      exe(r.add, () => r.add("Z")),
    );
    r.eq(["Z"]);
    i.I("b");
    r.eq(["Z"]);
  },

  "1_sync/input": () => {
    const r = res();
    const i = input("a")(
      take(1),
      exe(r.add, () => r.add("Z")),
    );
    r.eq(["a", "Z"]);
    i.I("aa");
    r.eq(["a", "Z"]);
  },

  "1_event": async () => {
    const r = res();
    const i = event()(
      take(1),
      exe(r.add, () => r.add("Z")),
    );
    r.eq([]);
    i.I("a");
    r.eq(["a", "Z"]);
  },
}));

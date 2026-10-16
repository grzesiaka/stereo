import { describe } from "~testing";

import { input, map, filter, scan, event } from "../src/index";

describe("base", ({ eq, res }) => ({
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

    // const yy = flatten(i);
    // console.log(yy);
  },

  scan_seed: () => {
    const r = res();
    const i = input(1)(
      map((x) => x * x),
      scan((acc, x) => acc + x, 0),
    )(r.add);
    r.eq([1]);
    i.Y.Y.I(2);
    i.Y.Y.I(3);
    i.Y.Y.I(4);
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

import { describe } from "~testing";

import { input, map, filter, scan } from "../src/index";

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
    i.P.I(2);
    r.eq([2, 4]);
  },

  filter: () => {
    const r = res();
    const i = input(1)(
      map((x) => x * x),
      filter((x) => x % 2 === 0),
    )(r.add);
    r.eq([]);
    i.P.P.I(2);
    i.P.P.I(3);
    i.P.P.I(4);
    r.eq([4, 16]);
  },

  scan_seed: () => {
    const r = res();
    const i = input(1)(
      map((x) => x * x),
      scan((x, a) => x + a, 0),
    )(r.add);
    r.eq([1]);
    i.P.P.I(2);
    i.P.P.I(3);
    i.P.P.I(4);
    r.eq([1, 1 + 4, 1 + 4 + 9, 1 + 4 + 9 + 16]);
  },

  scan_no_seed: () => {
    const r = res();
    const i = input(1)(
      map((x) => x * x),
      scan((x, a) => x + a),
    )(r.add);
    r.eq([1]);
    i.P.P.I(2);
    i.P.P.I(3);
    i.P.P.I(4);
    r.eq([1, 1 + 4, 1 + 4 + 9, 1 + 4 + 9 + 16]);
  },
}));

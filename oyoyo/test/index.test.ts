import { describe } from "~testing";

import { input, map } from "../src/index";

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
}));

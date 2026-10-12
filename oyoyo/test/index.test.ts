import { describe } from "~testing";

import { input } from "../src/index";

describe("base", ({ eq, res }) => ({
  input: () => {
    const r = res();
    const i = input(1, "in")()(r.add);
    eq(i.Id, "in");
    r.eq([1]);
    i.I(2);
    r.eq([1, 2]);
  },
}));

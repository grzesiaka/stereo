import { describe } from "~testing";

import IN from "./i";

describe(IN, ({ eq, res }) => ({
  no_context: () => {
    const { I, OO } = IN()(1);
    const r = res<number>();

    I(0);
    const d = OO(r.add);
    I(1);
    I(2);
    d();
    I(3);
    r.eq([1, 2]);
  },

  L_context: () => {
    const { I, OO } = IN()(1, "L");

    eq(I.I, "L");
    eq(OO.OO, "L");

    const r = res<number>();

    I(0);
    const d = OO(r.add);
    I(1);
    I(2);
    d();
    I(3);
    r.eq([1, 2]);
  },

  LR_context: () => {
    const { I, OO } = IN()(1, { "?": 1 }, "R");

    eq(I.I, { "?": 1 });
    eq(OO.OO, "R");

    const r = res<number>();

    I(0);
    const d = OO(r.add);
    I(1);
    I(2);
    d();
    I(3);
    r.eq([1, 2]);
  },
}));

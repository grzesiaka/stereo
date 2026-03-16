import { describe } from "~testing";

import EM from "../out/e.mjs";

describe(EM, ({ eq, res }) => ({
  no_context: () => {
    const { I, OO } = EM<number>()();
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
    const { I, OO } = EM<number>()("L");

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
    const { I, OO } = EM<number>()("L", "R");

    eq(I.I, "L");
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

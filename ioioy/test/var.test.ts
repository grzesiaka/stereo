import { describe } from "~testing";

import V from "../src/var";

describe(V, ({ eq, res }) => ({
  no_context: () => {
    const { I, O } = V(1);
    const r = res<number>();

    I(0);
    const d = O(r.add);
    I(1);
    I(2);
    d();
    I(3);
    r.eq([0, 1, 2]);
  },

  string_context: () => {
    const { I, O } = V(1, "L");

    eq(I.Id, "L");
    eq(O.Id, "L");

    const r = res<number>();

    I(0);
    const d = O(r.add);
    I(1);
    I(2);
    d();
    I(3);
    r.eq([0, 1, 2]);
  },

  object_context: () => {
    const { I, O } = V(1, { "?": 1 });

    eq(I["?"], 1);
    eq(O["?"], 1);

    const r = res<number>();

    I(0);
    const d = O(r.add);
    I(1);
    I(2);
    d();
    I(3);
    r.eq([0, 1, 2]);
  },
}));

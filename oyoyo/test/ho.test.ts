import { describe } from "~testing";
import { wrap, event, map, exe, take } from "../src";

describe(wrap, ({ eq, res }) => ({
  simple: () => {
    const r = res();
    const { I } = event<number>()(
      wrap(($, idx) => $(map((x) => x * idx))),
      exe(r.add),
    );
    r.eq([]);
    I(0);
    r.eq([0]);
    I(1);
    r.eq([0, 1]);
    I(2);
    r.eq([0, 1, 4]);
  },

  prev_completed: () => {
    const r = res();
    const { I, Z } = event<number>()(
      wrap(($, idx) => $(map((x) => x * idx))),
      take(2),
      exe(r.add),
    );

    eq(Z.__, ["take", 2]);
    Z.Z(() => r.add("DONE"));

    r.eq([]);
    I(0);
    r.eq([0]);
    I(1);
    r.eq([0, 1, "DONE"]);

    I(2); // no effect
    r.eq([0, 1, "DONE"]);
  },
}));

import { describe } from "~testing";
import { wrap, event, map, exe } from "../src";

describe(wrap, ({ res }) => ({
  simple: () => {
    const r = res();
    const { I } = event<number>()(
      wrap(($) => $(map((x) => x * x))),
      exe(r.add),
    );
    r.eq([]);
    I(1);
    r.eq([1]);
    I(2);
    r.eq([1, 4]);
  },
}));

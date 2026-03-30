import { describe } from "~testing";

import I from "../src/one-of";
import V from "../src/var";
import E from "../src/event";
import { __ } from "jsyoyo";

describe(I, ({ eq, res }) => ({
  empty: () => {
    const i = I()([]);
    eq(i.__, ["1of", []]);
  },

  single_var: () => {
    const i = I("1V")([V(0, "V1")]);
    eq(i.O.Id, "1V");
    eq(i.X, ["V1", 0]);
    const r = res();
    i.O(r.add);
    r.len(0);
    i.IOs.V1.I(1);
    r.last(1)(["V1", 1]);
    i.I(["V1", 2]);
    r.last(2)(["V1", 2]);
  },

  single_event: () => {
    const i = I({ Id: "1Ev", E: "xtra" })([E<number>()("Ev1")]);
    eq(i.O.Id, "1Ev");
    eq(i.O.E, "xtra");
    eq(i.X, ["Ev1", __]);
    const r = res();
    i.O(r.add);
    r.len(0);
    i.IOs.Ev1.I(1);
    r.last(1)(["Ev1", 1]);
    i.I(["Ev1", 2]);
    r.last(2)(["Ev1", 2]);
  },

  array: () => {
    const IOs = {
      B: E.B("B"),
      S: E.S("S"),
      N: E.N("N"),
    };
    const vs = [IOs.B, IOs.S, IOs.N];
    const i = I("[B,S,N]")(vs);
    eq(i.IOs, IOs);
    eq(i.O.Id, "[B,S,N]");
    eq(i.$1, IOs.B);
    const r = res();
    i.O(r.add);
    r.last(0);
    i.I(["B", true]);
    i.I(["S", ""]);
    i.I(["N", 0]);
    r.eq([
      ["B", true],
      ["S", ""],
      ["N", 0],
    ]);
    // IOs.B is not observed by i; not sure if this is always desired -- if needed, could be controlled by an option
    IOs.B.I(false);
    r.len(3);

    // IOs.N is observed by i
    IOs.N.I(1);
    r.last(4)(["N", 1]);

    // IOs.S is not observed by i
    IOs.S.I("");
    r.len(4);
  },
}));

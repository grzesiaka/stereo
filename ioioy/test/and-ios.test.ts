import { describe } from "~testing";
import { __ } from "~js";

import A from "../src/and-ios";
import V from "../src/var";
import E from "../src/event";

describe(A, ({ eq, res }) => ({
  empty: () => {
    const and = A("")([]);
    eq(and.X, {});
  },
  single: () => {
    const a = A("AND")([V("", "str"), V(0, { Id: "num" }), E<1>()("eve")]);
    eq(a.X, { str: "", num: 0, eve: __ });
    eq(a.O.Id, "AND");
    const r = res<unknown>();
    a.O(r.add);
    r.eq([]);
    a.IOs.$.eve.I(1);
    r.eq([{ str: "", num: 0, eve: 1 }]);
    a.IOs.$.eve.I(1);
    r.last(2)({ str: "", num: 0, eve: 1 });
    a.I({ str: "S", num: 1 });
    r.last(3)({ str: "S", num: 1, eve: 1 });
    eq(a.IOs.$.str.X, "S");
    eq(a.IOs.$.num.X, 1);
  },
}));

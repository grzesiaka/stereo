import { describe } from "~testing";

import A from "../src/and";
import V from "../src/var";
import E from "../src/event";
import { __ } from "~js";

describe(A, ({ eq, res }) => ({
  empty: () => {
    const and = A("")([]);
    eq(and.X, {});
  },
  single: () => {
    const a = A("AND")([V("", "str"), V(0, { Id: "num" }), E<1>()("eve")]);
    eq(a.X, { str: "", num: 0, eve: __ });
    const r = res<unknown>();
    a.O(r.add);
    r.eq([]);
    a.ById.eve.I(1);
    r.eq([{ str: "", num: 0, eve: 1 }]);
    a.ById.eve.I(1);
    r.last(2)({ str: "", num: 0, eve: 1 });
    a.I({ str: "S", num: 1 });
    r.last(3)({ str: "S", num: 1, eve: 1 });
    eq(a.ById.str.X, "S");
    eq(a.ById.num.X, 1);
  },
}));

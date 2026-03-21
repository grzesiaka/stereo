import { describe } from "~testing";
import { __ } from "~js";

import A from "../src/and-vars";
import V from "../src/var";

describe(A, ({ eq, res }) => ({
  empty: () => {
    const and = A("")([]);
    eq(and.X, {});
  },
  single: () => {
    const a = A("AND")([V("", "str"), V(0, { Id: "num" }), V(false, "bool")]);
    eq(a.X, { str: "", num: 0, bool: false });
    eq(a.O.Id, "AND");
    const r = res<unknown>();
    a.O(r.add);
    r.eq([]);
    a.ById.bool.I(true);
    r.eq([{ str: "", num: 0, bool: true }]);
    a.ById.bool.I(true);
    r.last(2)({ str: "", num: 0, bool: true });
    a.I({ str: "S", num: 1 });
    r.last(3)({ str: "S", num: 1, bool: true });
    eq(a.ById.str.X, "S");
    eq(a.ById.num.X, 1);
    eq(a.ById.bool.X, true);
  },
}));

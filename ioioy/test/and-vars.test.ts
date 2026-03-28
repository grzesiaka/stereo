import { describe } from "~testing";
import { __ } from "~js";

import A from "../src/and-vars";
import V from "../src/var";

describe(A, ({ eq, res }) => ({
  empty_no_context: () => {
    const and = A()([]);
    eq(and.X, {});
  },
  empty_id_context: () => {
    const and = A("id")([]);
    eq(and.X, {});
    eq(and.O.Id, "id");
  },
  empty_object_context: () => {
    const and = A({ Id: "id", Extra: 0 })([]);
    eq(and.X, {});
    eq(and.O.Id, "id");
    eq(and.O.Extra, 0);
  },
  single: () => {
    const a = A("AND")([V("", "str"), V(0, { Id: "num" }), V(false, "bool")]);
    eq(a.X, { str: "", num: 0, bool: false });
    eq(a.O.Id, "AND");
    const r = res<unknown>();
    a.O(r.add);
    r.eq([]);
    a.IOs.bool.I(true);
    r.eq([{ str: "", num: 0, bool: true }]);
    a.IOs.bool.I(true);
    r.last(2)({ str: "", num: 0, bool: true });
    a.I({ str: "S", num: 1 });
    r.last(3)({ str: "S", num: 1, bool: true });
    eq(a.IOs.str.X, "S");
    eq(a.IOs.num.X, 1);
    eq(a.IOs.bool.X, true);
  },
}));

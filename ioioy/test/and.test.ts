import { describe } from "~testing";

import A from "../src/and";
import Var from "../src/var";
import E from "../src/event";

describe(A, ({ eq, res }) => ({
  empty: () => 1,
  single: () => {
    const r = A("AND")([Var("", "str"), Var(0, { Id: "num" }), E<1>()("eve")]);
    r.O();
    r.I.V;
  },
}));

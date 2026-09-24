import { describe } from "~testing";
import { ERR, init } from "../src";

import * as jsyoyo from "jsyoyo";

import j from "jsyoyo/_";

describe("", ({ eq }) => ({
  init: async () => {
    const ctx = await init({
      a: () => Promise.resolve(1),
      b: { bb: () => "b.bb" },
      json: [],
      jsyoyo: j,
    });
    eq(ctx, { a: 1, b: { bb: "b.bb" }, json: [], jsyoyo });
  },
  ERR: () => {
    eq(ERR.abort() instanceof Error, true);
    const e = new ERR.abort.$("ctx");
    eq(e instanceof Error, true);
    eq(e instanceof ERR.abort.$, true);
    eq(e.name, "taskyo.err.abort");
    eq(e.ctx, ["ctx"]);
  },
}));

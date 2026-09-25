import { describe } from "~testing";
import { ERR, loadDeps, load1, run, spec } from "../src";

import * as jsyoyo from "jsyoyo";

import j from "jsyoyo/_";

import { __ } from "jsyoyo";

describe("run", ({ eq }) => ({
  emptish: async () => {
    const s = spec({ Id: "proto" })()((params: 1 | 2) => [params], { Id: "run" })("last");
    eq(s.Id, "last");
    const l = await load1(s);
    const r = run(l)(1);

    eq(r.spec, l);
    eq(await r.promise, [1]);
  },
}));

describe("load / ERR", ({ eq }) => ({
  load: async () => {
    const ctx = await loadDeps({
      a: () => Promise.resolve(1),
      b: { bb: () => "b.bb" },
      json: [],
      jsyoyo: j,
    });
    eq(ctx, { a: 1, b: { bb: "b.bb" }, json: [], jsyoyo });
  },
  ERR: () => {
    eq(ERR.abort() instanceof Error, true);
    const e = new ERR.abort.$(__, "!");
    eq(e instanceof Error, true);
    eq(e instanceof ERR.abort.$, true);
    eq(e.name, "taskyo.error.abort");
    eq(e.ctx, [__, "!"]);
  },
}));

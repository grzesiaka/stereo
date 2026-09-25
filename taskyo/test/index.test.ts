import { describe } from "~testing";
import { ERR, loadDeps, load1, run, spec, asERR } from "../src";

import * as jsyoyo from "jsyoyo";

import j from "jsyoyo/_";

import { __, wait } from "jsyoyo";

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

describe(
  "timeout & abort",
  ({ v, eq }) => ({
    no_timeout_no_abort: async () => {
      const s = spec()()(() => wait(500, 1))("500ms");
      const r = await run(s)(1);
      v.vi.advanceTimersByTime(500);
      eq(await r.promise, 1);
    },

    timeout_no_abort: async () => {
      const s = spec({ timeout: 300 })()(() => wait(500, 1), { timeout: 150 })("500ms");
      const r = run(await load1(s))(1);
      v.vi.advanceTimersByTime(200); // v.vi.advanceTimersByTime(500); delivers `1` 99% an issue in vitest
      const x = await r.promise;
      const p = asERR(x);

      eq(p.name, "taskyo.error.timeout");
      eq(p.ctx[0], r);
    },

    abort_before_timeout: async () => {
      const s = spec({ timeout: 200 })()(() => wait(500, 1))("500ms");
      const abort = new jsyoyo.AbortController();
      const r = await run(s)(1, abort.signal);
      v.vi.advanceTimersByTime(100);
      abort.abort();
      const x = await r.promise;
      const p = asERR(x);
      eq(p.name, "taskyo.error.abort");
      eq(p.ctx[0], r);
    },

    abort_after_timeout: async () => {
      const s = spec({ timeout: 200 })()(() => wait(500, 1))("500ms");
      const abort = new jsyoyo.AbortController();
      const r = run(await load1(s))(1, abort.signal);
      v.vi.advanceTimersByTime(300);
      abort.abort();
      const x = await r.promise;
      const p = asERR(x);
      eq(p.name, "taskyo.error.timeout");
      eq(p.ctx[0], r);
    },
  }),
  (v) => {
    v.beforeEach(() => v.vi.useFakeTimers());
    v.afterEach(() => v.vi.clearAllTimers());
  },
);

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

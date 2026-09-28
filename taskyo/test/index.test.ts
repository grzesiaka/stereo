import { describe, $describe, setupFakeTimers } from "~testing";
import { ERR, loadDeps, load1, run, spec, asERR, RunState } from "../src";

import * as jsyoyo from "jsyoyo";

import j from "jsyoyo/_";

import { __, wait } from "jsyoyo";

$describe(setupFakeTimers)("retry", ({ eq, res, v }) => ({
  no_error: async () => {
    const s = spec()(() => 1)("", 0, { retry: () => wait(0) });
    const r = await run(s)(1);
    eq(await r.promise, 1);
  },

  errors: async () => {
    let i = -1;
    const re = res();
    const s = spec()(() => {
      if (++i === 3) return i;
      return new Error(`err_${i}` as const);
    })("", 0, {
      retry: (err) => {
        re.add(err.message);
        return wait(100);
      },
    });
    const r = run(s)(1);
    v.vi.advanceTimersByTimeAsync(300);
    eq(await (await r).promise, 3);
    re.eq(["err_0", "err_1", "err_2"]);
  },

  timeout: async () => {
    let i = -1;
    const re = res();

    const s = spec(
      j,
      {},
    )((_, { wait }) => {
      if (++i < 2) return wait(50);
      return 2;
    })("", 1, {
      retry: (err) => {
        re.add(err.name);
        return wait(100);
      },
    });

    const r = await run(s)(1);

    v.vi.advanceTimersByTimeAsync(300);
    eq(await r.promise, 2);
    re.eq(["taskyo.error.timeout", "taskyo.error.timeout"]);
  },
}));

describe("run", ({ eq, res }) => ({
  emptish: async () => {
    const s = spec()((params: 1 | 2) => [params])("id");

    eq(s.Id, "id");
    const l = await load1(s);

    const r = run(l)(1);

    eq(r.spec, l);
    eq(await r.promise, [1]);
  },

  state: async () => {
    const s = spec(
      j,
      (p) => ({ curr: 0, total: 2, _01: 0 }),
      (s) => (s._01 = s.curr / s.total),
    )(async (params: 0 | 1, { wait }, state) => {
      await wait(0);
      for (let i = params; i <= state().total; i++) {
        state({ curr: i });
        await wait(0);
      }
      return state();
    })("");

    const x = res<RunState>();
    const r = await run(s)(1);
    r.state(x.add);
    const e = await r.promise;
    eq(e, { curr: 2, total: 2, _01: 1 });
    x.eq([
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
    ]);
  },
}));

$describe(setupFakeTimers)("timeout & abort", ({ v, eq }) => ({
  no_timeout_no_abort: async () => {
    const s = spec()(() => wait(500, 1))("500ms");
    const r = await run(s)(1);

    v.vi.advanceTimersByTime(500);
    eq(await r.promise, 1);
  },

  overwritten_timeout_no_abort: async () => {
    const s = spec()(() => wait(500, 1))("150ms", 150);
    eq(s.timeout, 150);
    eq(s.Id, "150ms");
    const r = run(await load1(s))(1);
    v.vi.advanceTimersByTime(200); // v.vi.advanceTimersByTime(500); delivers `1` 99% an issue in vitest
    const x = await r.promise;
    const p = asERR(x);

    eq(p.name, "taskyo.error.timeout");
    eq(p.ctx[0], r);
  },

  abort_before_timeout: async () => {
    const s = spec()(() => wait(500, 1))("200ms", 200);
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
    const s = spec()(() => wait(500, 1))("200ms", 200);
    const abort = new jsyoyo.AbortController();
    const l = await load1(s);
    const r = run(l)(1, abort.signal);
    v.vi.advanceTimersByTime(300);
    abort.abort();
    const x = await r.promise;
    const p = asERR(x);
    eq(p.name, "taskyo.error.timeout");
    eq(p.ctx[0], r);
  },
}));

describe("load / ERR", ({ eq }) => ({
  load: async () => {
    const state = await loadDeps({
      a: () => Promise.resolve(1),
      b: { bb: () => "b.bb" },
      json: [],
      jsyoyo: j,
    });
    eq(state, { a: 1, b: { bb: "b.bb" }, json: [], jsyoyo });
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

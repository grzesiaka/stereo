import { describe, $describe, setupFakeTimers } from "~testing";
import { ERR, loadDeps, load1, run, spec, RunState, params } from "../src";
import { __, wait, ASSERT } from "jsyoyo";
import * as jsyoyo from "jsyoyo";
import j from "jsyoyo/_";

import "../src/_cache/memory";

export const count_012 = spec(
  j,
  (d) => ({ curr: 0, total: 2, _01: d.clamp(0, 1)(0 as number) }),
  (s, d) => (s._01 = d.clamp(0, 1)(s.curr / s.total)),
)(async (params: 0 | 1, { wait }, state) => {
  await wait(0);
  for (let i = params; i <= state().total; i++) {
    state({ curr: i });
    await wait(0);
  }
  return state();
})({
  Id: "count_012",
  cache: {
    key: (p, _d, id) => `${id}/${p}`,
    stores: ["memory"] as never, // importing is broken as 'taskyo' is only meaningful when 'taskyo' is imported from external module
    ttl: 10_000,
  },
});

$describe(setupFakeTimers)("retry", ({ eq, res, v }) => ({
  no_error: async () => {
    const s = spec()(() => 1)({ retry: () => wait(0) });
    const r = await run(s)();
    eq(await r.promise, 1);
  },

  errors: async () => {
    let i = -1;
    const re = res();
    const s = spec()(() => {
      if (++i === 3) return i;
      return new Error(`err_${i}` as const);
    })({
      retry: ([err]) => {
        re.add(err.message);
        return wait(100);
      },
    });
    const r = run(s)();
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
      if (++i < 2) return wait(2);
      return 2;
    })({
      timeout: 1,
      retry: ([err]) => {
        re.add(err.name);
        return wait(2);
      },
    });

    const r = await run(s)(1);

    v.vi.advanceTimersByTimeAsync(10);
    eq(await r.promise, 2);
    re.eq(["taskyo.error.timeout", "taskyo.error.timeout"]);
  },

  array: async () => {
    const r = await run(
      spec()(() => new Error())({
        retry: [1, 1, 1],
      }),
    )(1);
    v.vi.advanceTimersByTimeAsync(200);
    let e: unknown;
    try {
      e = await r.promise;
    } catch (_e) {
      e = _e;
    }
    const x = ASSERT(ERR.retry.is)(e);
    eq(x.run.runs.length, 4); // 1 + 3 retries
  },

  backoff: async () => {
    let i = 0;
    const re = res<number>();
    const r = await run(
      spec()(() => (i++ < 5 ? (re.add(Date.now()), new Error()) : i))({
        retry: {
          initDelay: 10,
          maxDelay: 1000,
        },
      }),
    )(1);
    v.vi.advanceTimersByTimeAsync(20_000);
    const x = await r.promise;
    eq(x, 6); // 1 + 5 retries
    eq(re.items.length, 5);
    eq(re.items[4]! - re.items[0]!, 10 + 20 + 40 + 80);
  },
}));

$describe(setupFakeTimers)("run", ({ eq, res, v }) => ({
  emptish: async () => {
    const s = params(spec()((params: 1 | 2) => [params])("id"), 1);

    eq(s.Id, "id");
    const l = await load1(s);

    const r = run(l)();

    eq(r.spec, l);
    eq(await r.promise, [1]);
  },

  state: async () => {
    const x = res<RunState>();
    const r = await run(count_012)(1);
    r.state(x.add);
    v.vi.advanceTimersByTimeAsync(10);
    const e = await r.promise;
    eq(e, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
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
    const s = spec()(() => wait(500, 1))({ Id: "150ms", timeout: 150 });
    eq(s.timeout, 150);
    eq(s.Id, "150ms");
    const r = run(await load1(s))(1);
    v.vi.advanceTimersByTime(200); // v.vi.advanceTimersByTime(500); delivers `1` 99% an issue in vitest
    const x = await r.promise;
    if (ERR.timeout.is(x)) {
      eq(x.name, "taskyo.error.timeout");
      eq(x.trace, [r]);
    }
  },

  abort_before_timeout: async () => {
    const s = spec()(() => wait(500, 1))({ timeout: 200 });
    const abort = new jsyoyo.AbortController();
    const r = await run(s)(1, abort.signal);
    v.vi.advanceTimersByTime(100);
    abort.abort();
    const x = await r.promise;
    const p = ASSERT.NAME("taskyo.error.abort")(x);
    eq(p.run, r);
  },

  abort_after_timeout: async () => {
    const s = spec.$({ timeout: 150 })()(() => wait(500, 1))({ timeout: 200 });
    const abort = new jsyoyo.AbortController();
    const l = await load1(s);
    const r = run(l)(1, abort.signal);
    v.vi.advanceTimersByTime(300);
    abort.abort();
    const x = await r.promise;
    const p = ASSERT.NAME("taskyo.error.timeout")(x);
    eq(p.trace, [r]);
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
    eq(ERR.abort({}) instanceof Error, true);
    const e = new ERR.abort.$({ reason: "!" });
    eq(e instanceof Error, true);
    eq(e instanceof ERR.abort.$, true);
    eq(e.name, "taskyo.error.abort");
    eq(e.reason, "!");
  },
}));

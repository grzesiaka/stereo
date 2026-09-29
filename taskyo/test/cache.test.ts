// @vitest-environment jsdom
import { $describe, setupFakeTimers } from "~testing";

import { __ } from "jsyoyo";

import { count_012 } from "./index.test";

import { CACHE, CacheService } from "../src/cache";
import { run, RunState } from "../src";

CACHE.config({ prefix: "test/" });

// import "../src/cache/memory";
// import "../src/cache/local-storage";

$describe(setupFakeTimers)("cache", ({ eq, res, v }) => ({
  memory: async () => {
    (CACHE.registry["memory" as never] as CacheService).clear();
    const x = res<RunState>();
    const $r = run(count_012);
    const r = await $r(1);
    r.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e = await r.promise;
    eq(e, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      // Not reported as the value is served from cache
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r.cached, __);

    const r2 = await $r(1);
    r2.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e2 = await r.promise;
    eq(e2, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r2.cached, true);

    v.vi.advanceTimersByTime(count_012.cache.ttl);
    const r3 = await $r(1);
    r3.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e3 = await r3.promise;
    eq(e3, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      // first run
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
      // cached
      { curr: 2, total: 2, _01: 1 },
      // after ttl
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r3.cached, __);
  },

  local_storage: async () => {
    const with_local = {
      ...count_012,
      cache: {
        ...count_012.cache,
        stores: ["local_storage"] as never,
      },
    };
    const x = res<RunState>();
    const $r = run(with_local);
    const r = await $r(1);
    r.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e = await r.promise;
    eq(e, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      // Not reported as the value is served from cache
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r.cached, __);

    const r2 = await $r(1);
    r2.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e2 = await r.promise;
    eq(e2, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r2.cached, true);

    v.vi.advanceTimersByTime(count_012.cache.ttl);
    const r3 = await $r(1);
    r3.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e3 = await r3.promise;
    eq(e3, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      // first run
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
      // cached
      { curr: 2, total: 2, _01: 1 },
      // after ttl
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r3.cached, __);
  },

  memory_and_local_storage: async () => {
    v.vi.advanceTimersByTime(100_000);
    (CACHE.registry["memory" as never] as CacheService).clear();
    (CACHE.registry["local_storage" as never] as CacheService).clear(true);

    const with_local = {
      ...count_012,
      cache: {
        ...count_012.cache,
        stores: ["memory", "local_storage"] as never,
      },
    };
    const x = res<RunState>();
    const $r = run(with_local);
    const r = await $r(1);
    r.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e = await r.promise;
    eq(e, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      // Not reported as the value is served from cache
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r.cached, __);

    const r2 = await $r(1);
    r2.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e2 = await r.promise;
    eq(e2, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r2.cached, true);

    v.vi.advanceTimersByTime(count_012.cache.ttl);
    const r3 = await $r(1);
    r3.state(x.add);
    v.vi.advanceTimersByTimeAsync(2);
    const e3 = await r3.promise;
    eq(e3, { curr: 2, total: 2, _01: 1 as never /* clamped */ });
    x.eq([
      // first run
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
      // cached
      { curr: 2, total: 2, _01: 1 },
      // after ttl
      { curr: 0, total: 2, _01: 0 },
      { curr: 1, total: 2, _01: 1 / 2 },
      { curr: 2, total: 2, _01: 1 },
    ]);
    eq(r3.cached, __);
  },
}));

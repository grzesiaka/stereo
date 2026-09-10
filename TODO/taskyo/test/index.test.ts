import { describe } from "~testing";

import { __, AbortController } from "jsyoyo";
import { awaiT } from "treeo";
import { indexify } from "proyij";

import { $progress, load, run, task, NEVER, _01, parallel, tick } from "../src";

const deps = () => ({
  tree: { o: import("treeo") },
  ioioy: import("ioioy"),
});
const Spec = task({ units: "%", total: 100, failed: __ as __<"abort"> }, (i) => ({ ...i, _01: _01(i.curr, i.total) }))(
  deps,
);
const IO = <ID extends string, Ticks extends number = 2>(I: ID, T = 2 as Ticks) =>
  task({ total: 1 })(deps)<ID, Promise<number>>(async (p, _d, _abo, u) => {
    for (let i = 0; i < T; i++) {
      await tick();
      u(i / T);
    }
    u(1);
    return p.length;
  })(I);

const specs = indexify("Id")([IO("A", 1), IO("B", 2), IO("C", 4)]);

describe(parallel, ({ eq, res }) => ({
  simple: async () => {
    const s = parallel("II", specs);
    const r = run(s)({ A: "A", B: "B", C: "C" });
    const pr = res();
    eq(r.progress(), { curr: 0, total: 3, partial: { A: __, B: __, C: __ } });
    r.progress((x) => pr.add({ ...x, partial: { ...x.partial } }), true);
    eq(await r, { A: 1, B: 1, C: 1 });
    pr.eq([
      { curr: 0, total: 3, partial: { A: __, B: __, C: __ } },
      { curr: 1, total: 3, partial: { A: 1, B: __, C: __ } },
      { curr: 2, total: 3, partial: { A: 1, B: 1, C: __ } },
      { curr: 3, total: 3, partial: { A: 1, B: 1, C: 1 } },
    ]);
  },
  error: () => 1,
}));

describe(run, ({ eq, res }) => ({
  "+1": async () => {
    const s = Spec((p: number) => p + 1)("");
    const r = await run(s)(1);
    r;
    const d = await awaiT(deps());
    eq(s.loaded, d);
    eq(r, 2);
  },
  self: async () => {
    const s = Spec((P: { a: "B" }, $, a, u, s) => ({ P, $, a, u, s }))("");

    const r = await run(s)({ a: "B" });
    const d = await awaiT(deps());

    eq(r.$, d);
    eq(r.P, { a: "B" });
  },

  progress: async () => {
    const s = Spec(async (_, _$, _a, p) => {
      p(50);
      await tick();
      p(100);
      return "ok" as const;
    })("");

    const pr = run(s)(1);
    const re = res();
    pr.progress((x) => re.add(x.curr));
    const r = await pr;
    eq(r, "ok");
    re.eq([0, 50, 100]);
  },

  abort: async () => {
    const s = Spec(async (_, _$, abo, p) => {
      abo(() => p(p().curr, { failed: "abort" }));
      p(50);
      await tick(2);
      !p().failed && p(100);
      return p().failed ? NEVER : ("ok" as const);
    })("");

    const abort = new AbortController();
    const pr = run(s)(1, abort.signal);
    const re = res();
    pr.progress((x) => re.add(x.curr));
    re.eq([0]);
    // It waits for dynamic imports to resolve
    while (re.items.length < 2) await tick();
    re.eq([0, 50]);
    abort.abort();
    while (re.items.length < 3) await tick();
    re.eq([0, 50, 50]); // the last 50 after abortion
    eq(pr.progress().failed, "abort");
  },

  abort_manual_load: async () => {
    const s = Spec(async (_, _$, abo, p) => {
      abo(() => p(p().curr, { failed: "abort" }));
      p(50);
      await tick(2);
      !p().failed && p(100);
      return p().failed ? NEVER : ("ok" as const);
    })("");

    await load(s);

    const abort = new AbortController();
    const pr = run(s)(1, abort.signal);

    const re = res();
    pr.progress((x) => re.add(x.curr));
    re.eq([0]);
    eq(pr.progress().curr, 0);
    await tick(2);
    re.eq([0, 50]);
    eq(pr.progress()._01, 0.5);
    abort.abort();
    while (re.items.length < 3) await tick();
    re.eq([0, 50, 50]); // the last 50 after abortion
    eq(pr.progress().failed, "abort");
  },
}));

describe($progress, ({ eq, res }) => ({
  indeterminate: () => {
    const [p, update] = $progress({ total: Infinity }, (i) => ({ a: "A" as const, ...i }));
    eq(p.X.total, Infinity);
    eq(p.X.curr, 0);
    eq(p.X.a, "A");
    update(1);
  },
  0: () => {
    const [p, u] = $progress({ total: 1 as number & { 1: 1 } });

    const r = res();
    p.O((x) => r.add(_01(x.curr, x.total)));

    eq(p.X.total, 1 as number & { 1: 1 });
    eq(p.X.curr, 0);
    u(0.5 as number & { 1: 1 });
    eq(p.X.total, 1 as number & { 1: 1 });
    eq(p.X.curr, 0.5 as never);
    u(1 as number & { 1: 1 });
    eq(p.X.total, 1 as number & { 1: 1 });
    eq(p.X.curr, 1 as never);

    r.eq([0, 0.5, 1]);
  },
}));

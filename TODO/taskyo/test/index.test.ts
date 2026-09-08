import { describe } from "~testing";

import { __, AbortController } from "jsyoyo";
import { awaiT } from "treeo";

import { $progress, load, run, spec, taskyo, NEVER, Taskyo, _01 } from "../src";
import { indexify } from "proyij";

const deps = () => ({
  tree: { o: import("treeo") },
  ioioy: import("ioioy"),
});
const Spec = spec({ units: "%", total: 100 })("TEST", deps);
const I = <ID extends string>(I: ID) => spec({ total: 1 })(I, deps);
const fakeAbort = new Proxy({} as any, { get: () => () => 1 });
const tick = (n = 1): Promise<void> => (n <= 1 ? Promise.resolve() : tick(n - 1).then(() => Promise.resolve()));

describe(taskyo, ({ eq }) => ({
  empty: () => {
    const t = new Taskyo({}, []);
    eq([t.specs, t.steps, t.ctx], [{}, [], __]);
  },
  simple: () => {
    const i = indexify("ID")([Spec<number, 1>(() => 1), I("2")<number, 2>(() => 2)]);
    taskyo(i)
      .$params(
        "start",
        () =>
          ({
            TEST: 8,
            2: 8,
          }) as const,
      )
      .$("later", (ctx) => ctx);
  },
}));

describe(run, ({ eq, res }) => ({
  "+1": async () => {
    const s = Spec((p: number) => p + 1);
    const r = await run(s)(1, new Proxy({} as any, { get: () => () => 1 }));
    const d = await awaiT(deps());
    eq(s.loaded, d);
    eq(r, 2);
  },
  self: async () => {
    const s = Spec((P: { a: "B" }, $, a, u, s) => ({ P, $, a, u, s }));

    const r = await run(s)({ a: "B" }, fakeAbort);
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
    });

    const pr = run(s)(1, fakeAbort);
    const re = res();
    pr.progress((x) => re.add(x.curr));
    const r = await pr;
    eq(r, "ok");
    re.eq([0, 50, 100]);
  },

  abort: async () => {
    const s = Spec(async (_, _$, _a, p) => {
      _a(() => 1);
      p(50);
      await tick(2);
      !p().failed && p(100);
      return p().failed ? NEVER : ("ok" as const);
    });

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
    const s = Spec(async (_, _$, _a, p) => {
      _a(() => 1);
      p(50);
      await tick(2);
      !p().failed && p(100);
      return p().failed ? NEVER : ("ok" as const);
    });

    await load(s);

    const abort = new AbortController();
    const pr = run(s)(1, abort.signal);

    const re = res();
    pr.progress((x) => re.add(x.curr));
    re.eq([0]);
    eq(pr.progress().curr, 0);
    await tick(2);
    re.eq([0, 50]);
    abort.abort();
    while (re.items.length < 3) await tick();
    re.eq([0, 50, 50]); // the last 50 after abortion
    eq(pr.progress().failed, "abort");
  },
}));

describe($progress, ({ eq, res }) => ({
  indeterminate: () => {
    const [p, update] = $progress({ total: Infinity })();
    eq(p.X.total, Infinity);
    eq(p.X.curr, 0);
    update(1);
  },
  0: () => {
    const [p, u] = $progress({ total: 1 as number & { 1: 1 } })();

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

import { describe } from "~testing";

import { $progress, load, run, spec } from "../src";
import { __, id } from "jsyoyo";
import { awaiT } from "treeo";
import { NEVER } from "../src/_utils";

const deps = () => ({
  tree: { o: import("treeo") },
  ioioy: import("ioioy"),
});
const Spec = spec("TEST", "%", 100)(deps);
const fakeAbort = new Proxy({} as any, { get: () => () => 1 });
const tick = (n = 1): Promise<void> => (n <= 1 ? Promise.resolve() : tick(n - 1).then(() => Promise.resolve()));

describe(run, ({ eq, res }) => ({
  "+1": async () => {
    // const s = Spec((P: { a: "B" }, $, a, u, s) => ({ P, $, a, u, s }));
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
    pr.progress((x) => re.add(x.value));
    const r = await pr;
    eq(r, "ok");
    re.eq([0, 50, 100]);
  },

  abort: async () => {
    const s = Spec(async (_, _$, _a, p) => {
      _a(() => 1);
      p(50);
      await tick(2);
      !p().X.aborted && p(100);
      return p().X.aborted ? NEVER : ("ok" as const);
    });

    let _abort = __ as __<() => void>;
    const pr = run(s)(1, {
      addEventListener: (_: any, a: any) => (_abort = a),
    } as any);
    const re = res();
    pr.progress((x) => re.add(x.value));
    await tick(4);
    re.eq([0]);
    // It waits for dynamic imports to resolve
    while (!_abort) await tick();
    re.eq([0, 50]);
    _abort();
    while (re.items.length < 3) await tick();
    re.eq([0, 50, 50]);
    eq(pr.progress().aborted, true);
  },

  abort_manual_load: async () => {
    const s = Spec(async (_, _$, _a, p) => {
      _a(() => 1);
      p(50);
      await tick(2);
      !p().X.aborted && p(100);
      return p().X.aborted ? NEVER : ("ok" as const);
    });

    await load(s);

    let _abort = __ as __<() => void>;
    const pr = run(s)(1, {
      addEventListener: (_: any, a: any) => {
        console.log("--->", a);
        _abort = a;
      },
    } as any);
    const re = res();
    pr.progress((x) => re.add(x.value));
    await tick(1);
    re.eq([0]);
    re.eq([0, 50]);
    console.log("abort");
    _abort();
    while (re.items.length < 3) await tick();
    re.eq([0, 50, 50]);
    eq(pr.progress().aborted, true);
  },
}));

describe($progress, ({ eq, res }) => ({
  __: () => {
    const p = $progress({ ID: "TEST", progress: ["", __] });
    eq(p().X.total, __);
    eq(p().X.value, 0);
  },
  0: () => {
    const p = $progress({ ID: "TEST", progress: ["", __ as __<number & { 1: 1 }>] }, 1 as number & { 1: 1 });

    const r = res();
    p().O((x) => r.add(x._01));

    eq(p().X.total, 1 as number & { 1: 1 });
    eq(p().X.value, 0);
    p(0.5 as number & { 1: 1 });
    eq(p().X.total, 1 as number & { 1: 1 });
    eq(p().X.value, 0.5 as never);
    p(1 as number & { 1: 1 });
    eq(p().X.total, 1 as number & { 1: 1 });
    eq(p().X.value, 1 as never);

    r.eq([0, 0.5, 1]);
  },
}));

import { describe } from "~testing";

import { $progress, run, spec } from "../src";
import { __ } from "jsyoyo";
import { awaiT } from "treeo";

const deps = () => ({
  tree: { o: import("treeo") },
  ioioy: import("ioioy"),
});
const Spec = spec("TEST", "%", 100)(deps);

describe(run, ({ eq }) => ({
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

    const r = await run(s)({ a: "B" }, new Proxy({} as any, { get: () => () => 1 }));
    const d = await awaiT(deps());

    eq(r.$, d);
    eq(r.P, { a: "B" });
  },

  progress: async () => {
    const s = Spec(async (_, _$, a, p) => {
      p(50);
      await Promise.resolve();
      p(100);
      return "ok";
    });
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

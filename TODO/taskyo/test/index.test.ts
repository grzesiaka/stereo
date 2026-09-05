import { describe } from "~testing";

import { $progress, run, spec } from "../src";
import { __ } from "jsyoyo";
import { AbortController } from "../src/_utils";

const Spec = spec(
  "TEST",
  "%",
  100,
)(() => ({
  tree: { o: import("treeo") },
  ioioy: import("ioioy"),
}));

describe(run, ({ eq }) => ({
  "{}": async () => {
    const s = Spec((P: { a: "B" }, $, a, u, s) => ({ P, $, a, u, s }));
    // const s = Spec(() => 1);
    s.load();
    const r = await run(s)(["WTF?!", s], new Proxy({} as any, { get: () => () => 1 }));

    eq(r);
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

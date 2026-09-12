import { describe } from "~testing";

import { __, AbortController } from "jsyoyo";
import { awaiT } from "treeo";
import { indexify } from "proyij";

import { $progress, load, run, task, NEVER, _01, parallelTree, tick, AbortError } from "../src";
import { choice } from "../src/choice";
import { parallel } from "../src/parallel";
import { sequence } from "../src/sequence";

const deps = () => ({
  tree: { o: import("treeo") },
  ioioy: import("ioioy"),
});
const TSK = task({ units: "%", total: 100, _01: 0 as number, failed: __ as __<"abort"> }, (i) => {
  i._01 = _01(i.curr, i.total);
})(deps);

const IO = <ID extends string, Ticks extends number = 2>(I: ID, T = 2 as Ticks) =>
  task({ total: T })(deps)<ID, Promise<number>>(async (p, _d, _abo, u) => {
    for (let i = 0; i < T; i++) {
      await tick();
      i && u(i); // zero is the start value any way, so no point to report it twice
    }
    u(T);
    return p.length as ID["length"] & { tag: ID };
  })(I);

const tasks = () => [IO("A", 1), IO("B", 2), IO("C", 4)] as const;
const taskObj = () => indexify("Id")(tasks());

describe(sequence, ({ eq, res }) => ({
  step_0_only: async () => {
    const $ = sequence(TSK((p: 112) => p)("step_0"));
    const t = $.asTask("0");
    const x = run(t)(112);
    const re = res();
    x.progress(re.add);

    const r = await x;

    re.eq([
      {
        _01: 0,
        curr: 0,
        partial: {},
        total: 1,
      },
      {
        _01: 1,
        curr: 1,
        partial: {
          step_0: 112,
        },
        total: 1,
      },
    ]);
    eq(r, {
      step_0: 112,
    });
  },

  simple: async () => {
    const { A, B, C } = taskObj();
    const t = sequence(TSK((p: 0) => [p, "A"] as const)("0"))
      .$(A, (x) => x["0"][1])
      .$(B, () => "B")
      .$(C, () => "C")
      .$(TSK((p: readonly number[]) => p.reduce((a, n) => a + n, 0))("sum"), (x) => [x.A, x.B, x.C])
      .asTask("1");
    const x = run(t)(0);
    const re = res();
    x.progress(re.add);

    const r = await x;

    // re.eq(sequenceSimpleResult());
    re.eq(sequenceSimpleResult());
    eq(r, { "0": [0, "A"], A: 1, B: 1, C: 1, sum: 3 });
  },
}));

describe(choice, ({ eq, res }) => ({
  simple_choice: async () => {
    const ts = tasks();
    const c = choice(ts)("⨁");
    eq(c.__, ["⨁", ts]);

    const rp = run(c)(["C", "C"]);

    const re = res();
    const p0 = { curr: 0, total: Infinity, "⨁": __ };
    const p = <N extends number>(curr: N) => ({ curr, total: 4, "⨁": "C" });

    eq(rp.progress(), p0);

    rp.progress((x) => {
      re.add(x);
      !x["⨁"] && eq(rp.progress(), p0);
    });

    const r = await rp;

    re.eq([p0, p(0), p(1), p(2), p(3), p(4)]);

    eq(r, 1);
  },

  abort: async () => {
    const c = choice(tasks())("⨁");
    const abort = new AbortController();
    const rp = run(c)(["C", "C"], abort.signal);
    let err: unknown;
    try {
      await tick(1);

      abort.abort();

      await rp;
    } catch (e) {
      err = e;
    }

    eq(err instanceof AbortError, true);
    eq(err, rp.progress().failed);
  },
}));

describe(parallel, ({ eq, res }) => ({
  simple: async () => {
    const s = parallel(tasks())("II");
    const r = run(s)({ A: "A", B: "B", C: "C" });
    const pr = res();
    eq(r.progress(), {
      _01: 0,
      "⨂": __,
      curr: 0,
      total: 3,
      partial: { A: __, B: __, C: __ },
    });

    r.progress((x) => pr.add([x.curr, x.total, x._01, { ...x.partial }]), true);
    eq(await r, { A: 1, B: 1, C: 1 });
    pr.eq(parallelTreeSimpleResults().map((x) => [x.curr, x.total, x._01, x.partial]));
  },
  error: () => 1,
}));

describe(parallelTree, ({ eq, res }) => ({
  simple: async () => {
    const s = parallelTree(taskObj())("II");
    const r = run(s)({ A: "A", B: "B", C: "C" });
    const pr = res();
    eq(r.progress(), { "⨂": __, _01: 0, curr: 0, total: 3, partial: { A: __, B: __, C: __ } });

    r.progress((x) => pr.add([x.curr, x.total, x._01, { ...x.partial }]), true);
    eq(await r, { A: 1, B: 1, C: 1 });
    pr.eq(parallelTreeSimpleResults().map((x) => [x.curr, x.total, x._01, x.partial]));
  },
  abort: async () => {
    const s = parallelTree(taskObj())("II");
    const abort = new AbortController();
    const rp = run(s)({ A: "A", B: "B", C: "C" }, abort.signal);

    let err: unknown;
    try {
      await tick(1);
      abort.abort();

      await rp;
    } catch (e) {
      err = e;
    }

    eq(rp.progress().partial, { A: __, B: __, C: __ });
    eq(err instanceof AbortError, true);
    eq(err, rp.progress().failed);
  },
}));

describe(run, ({ eq, res }) => ({
  "+1": async () => {
    const s = TSK((p: number) => p + 1)("");
    const r = await run(s)(1);
    r;
    const d = await awaiT(deps());
    eq(s.loaded, d);
    eq(r, 2);
  },
  self: async () => {
    const s = TSK((P: { a: "B" }, $, a, u, s) => ({ P, $, a, u, s }))("");

    const r = await run(s)({ a: "B" });
    const d = await awaiT(deps());

    eq(r.$, d);
    eq(r.P, { a: "B" });
  },

  progress: async () => {
    const s = TSK(async (_, _$, _a, p) => {
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
    const s = TSK(async (_, _$, abo, p) => {
      abo(() => p(p().curr, { failed: "abort" }));
      p(50);
      await tick(2);
      !p().failed && p(100);
      return p().failed ? NEVER : ("ok" as const);
    })("");

    const abort = new AbortController();
    let err: unknown;
    try {
      const pr = run(s)(1, abort.signal);
      const re = res();
      pr.progress((x) => re.add(x.curr));
      re.eq([0]);
      // It waits for dynamic imports to resolve
      while (re.items.length < 2) await tick();
      re.eq([0, 50]);
      abort.abort();
      await pr;
      eq(1, 2 as 1);
      while (re.items.length < 3) await tick();
      re.eq([0, 50, 50]); // the last 50 after abortion
      eq(pr.progress().failed, "abort");
    } catch (e) {
      err = e;
    }
    eq(err instanceof AbortError);
  },

  abort_manual_load: async () => {
    const s = TSK(async (_, _$, abo, p) => {
      abo(() => p(p().curr, { failed: "abort" }));
      p(50);
      await tick(2);
      !p().failed && p(100);
      return p().failed ? NEVER : ("ok" as const);
    })("");

    await load(s);
    let err: unknown;
    try {
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
      await pr;
      while (re.items.length < 3) await tick();
      re.eq([0, 50, 50]); // the last 50 after abortion
      eq(pr.progress().failed, "abort");
    } catch (e) {
      err = e;
    }
    eq(err instanceof AbortError);
  },
}));

describe($progress, ({ eq, res }) => ({
  indeterminate: () => {
    const [p, update] = $progress({ total: Infinity, a: "A" });
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

const parallelTreeSimpleResults = () => [
  {
    _01: 0,
    curr: 0,
    partial: {
      A: undefined,
      B: undefined,
      C: undefined,
    },
    total: 3,
  },
  {
    _01: 0.16666666666666666,
    curr: 0,
    partial: {
      A: undefined,
      B: undefined,
      C: undefined,
    },
    total: 3,
  },
  {
    _01: 0.25,
    curr: 0,
    partial: {
      A: undefined,
      B: undefined,
      C: undefined,
    },
    total: 3,
  },
  {
    _01: 0.3333333333333333,
    curr: 0,
    partial: {
      A: undefined,
      B: undefined,
      C: undefined,
    },
    total: 3,
  },
  {
    _01: 0.41666666666666663,
    curr: 0,
    partial: {
      A: undefined,
      B: undefined,
      C: undefined,
    },
    total: 3,
  },
  {
    _01: 0.75,
    curr: 1,
    partial: {
      A: 1,
      B: undefined,
      C: undefined,
    },
    total: 3,
  },
  {
    _01: 0.9166666666666666,
    curr: 2,
    partial: {
      A: 1,
      B: 1,
      C: undefined,
    },
    total: 3,
  },
  {
    _01: 1,
    curr: 3,
    partial: {
      A: 1,
      B: 1,
      C: 1,
    },
    total: 3,
  },
];

function sequenceSimpleResult() {
  return [
    {
      _01: 0,
      curr: 0,
      partial: {},
      total: 5,
    },
    {
      _01: 0.2, // 20% 0 done
      curr: 1,
      partial: {
        "0": [0, "A"],
      },
      total: 5,
    },
    {
      _01: 0.4, // +20% A done
      curr: 2,
      partial: {
        "0": [0, "A"],
        A: 1,
      },
      total: 5,
    },
    {
      _01: 0.5, // +20%/2
      curr: 2,
      partial: {
        "0": [0, "A"],
        A: 1,
      },
      total: 5,
    },
    {
      _01: 0.6, // +20%/2 B done
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.65, // +20%/4
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.7, // +20%/4
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.75, // +20%/4
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.8, // +20%/4 C done
      curr: 4,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
        C: 1,
      },
      total: 5,
    },
    {
      _01: 1, // +20% sum done
      curr: 5,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
        C: 1,
        sum: 3,
      },
      total: 5,
    },
  ];
}

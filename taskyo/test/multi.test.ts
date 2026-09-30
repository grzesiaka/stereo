import { describe } from "~testing";

import { __, a, AbortController, tick } from "jsyoyo";
import { Tree } from "treeo";
import { indexify } from "proyij";

import { run, choice, parallel, spec, ERR, sequence, Spec } from "../src";

const IO = <ID extends string, Ticks extends number = 2>(I: ID, T = 2 as Ticks) =>
  spec(__, { curr: 0, total: T })<ID, Promise<number>>(async (p, _d, u) => {
    for (let i = 0; i < T; i++) {
      await tick();
      i && u({ curr: i }); // zero is the start value any way, so no point to report it twice
    }
    u({ curr: T });
    return p.length;
  })(I);

const specs = () => [IO("A", 1), IO("B", 2), IO("C", 4)] as const;
const specObj = <E extends Tree<Spec> = {}>(e = {} as E) => a(indexify("Id")(specs()), e);

describe(sequence, ({ eq, res }) => ({
  step_0_only: async () => {
    const $ = sequence(spec()((p: 112) => p)("step_0"));
    const t = $.asSpec("0");
    const x = await run(t)(112);
    const re = res();
    x.state(re.add);

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
    eq(await r.promise, {
      step_0: 112,
    });
  },

  simple: async () => {
    const { A, B, C } = specObj();
    const t = sequence(spec()((p: 0) => [p, "A"] as const)("0"))
      .$(A, (x) => x["0"][1])
      .$(B, () => "B")
      .$(C, () => "C")
      .$(spec()((p: readonly number[]) => p.reduce((a, n) => a + n, 0))("sum"), (x) => [x.A, x.B, x.C])
      .asSpec("1");
    const x = await run(t)(0);
    const re = res();
    x.state(re.add);

    const r = await x.promise;

    // re.eq(sequenceSimpleResult());
    eq(r, { "0": [0, "A"], A: 1, B: 1, C: 1, sum: 3 });
  },

  error: async () => {
    const { A, B, C } = specObj();
    const t = sequence(spec()((p: 0) => [p, "A"] as const)("0"))
      .$(A, (x) => x["0"][1])
      .$(B, () => "B")
      .$(C, () => "C")
      .$(spec()((p: readonly number[]) => p.reduce((a, n) => a + n, 0))("sum"), (x) => [x.A, x.B, x.C])
      .$(
        spec()((p) => {
          throw p;
        })("!"),
        (x) => x.sum,
      )
      .asSpec("1");

    const r = run(t)(0);

    let err = {} as ERR["critical"]["$"];
    try {
      await r;
    } catch (e) {
      err = e as never;
    }
    eq(err instanceof ERR["critical"]["$"], true);
    // eq(err.cause.source, 3);
    // eq(err.taskIds, ["!", "1"]);
    // eq(err.cause.state.failed instanceof ERR['critical']['$'], true);
  },

  recovery_0_step: async () => {
    const ERR = new Error("!");
    let err = __ as __ | ERR["critical"]["$"];

    const t = sequence(spec()(() => ERR as 0 | Error)("0"));
    const r0 = run(t.asSpec("!"))("!");

    let x: unknown;
    try {
      x = await r0;
    } catch (e) {
      err = e as never;
    }
    eq(err, __);
    eq(x, ERR);

    const t2 = t.$(IO("A"), () => "A");
    eq(ERR as unknown, await run(t2.asSpec("t2"))("!"));

    const t3 = t2
      .$(IO("B"), () => "B")
      ._(spec()((p: readonly [Error, Error]) => p)("OK"), (e) => [e, e])
      .S(spec()(() => 1 as const)("NO_PARAM"));
    const x3 = await run(t3.asSpec("t3"))("!");
    eq(await x3.promise, { OK: [ERR, ERR], NO_PARAM: 1 });
  },
}));

describe(choice, ({ eq, res }) => ({
  simple_choice: async () => {
    const ts = specs();
    const c = choice(ts)("⨁");
    eq(c.__, ["⨁", ts]);
    const rp = await run(c)(["C", "C"]);
    const re = res();

    const p = <N extends number>(curr: N) => ({ curr, total: 4 });
    rp.state((x) => re.add(x));
    const r = await rp.promise;

    re.eq([p(0), p(1), p(2), p(3), p(4)]);

    eq(r, 1);
  },

  abort: async () => {
    const c = choice(specs())("⨁");
    const abort = new AbortController();
    const rp = await run(c)(["C", "C"], abort.signal);
    let err: unknown;
    try {
      await tick(1);

      abort.abort();

      err = await rp.promise;
    } catch (e) {
      err = e;
    }

    if (ERR["abort"].is(err)) {
      eq(err.ctx[0], rp);
    } else {
      eq(err, 1);
      throw "NOT_CRITICAL";
    }
  },

  error: async () => {
    const s = choice([...specs(), spec()((p: "!") => Promise.reject(p))("!!")])("⨁");
    const abort = new AbortController();
    const r = await run(s)(["!!", "!"], abort.signal);

    let err = {} as ERR["critical"]["$"];
    try {
      await r.promise;
    } catch (e) {
      err = e as never;
    }

    if (ERR["critical"].is(err)) {
      eq(err.ctx[0], "!");
      eq(err.ctx[1][1], r);
    } else {
      throw "NOT_CRITICAL";
    }
  },
}));

describe(`parallel`, ({ eq, res }) => ({
  simple: async () => {
    const ss = specs();
    const s = parallel(ss)("II", __, {});
    const r = await run(s)({ A: "A", B: "B", C: "C" });

    const pr = res();
    eq(r.state(), {
      curr: 0,
      total: 3,
      runs: {}, // TODO populate
    });

    r.state((x) => pr.add([x.curr, x.total]), true);
    eq(await r.promise, { A: 1, B: 1, C: 1 });
    // eq(await r.state()["⨂"]!.A, 1);
    // eq(r.state()["⨂"]!.B.state(), { curr: 2, total: 2 });

    pr.eq([
      //  [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  },
}));

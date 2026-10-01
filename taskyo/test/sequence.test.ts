import { describe } from "~testing";
import { __, ASSERT } from "jsyoyo";

import { run, spec, ERR, sequence } from "../src";

import { IO, specObj } from "./test-utils";

describe(sequence, ({ eq, res }) => ({
  step_0_only: async () => {
    const $ = sequence(spec()((p: 112) => p)("step_0"));
    const t = $.asSpec("0");
    const x = await run(t)(112);
    const re = res();
    x.state(re.add);

    const r = await x;

    eq(await r.promise, {
      step_0: 112,
    });

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

    re.eq(results.simple);
    eq(r, { "0": [0, "A"], A: 1, B: 1, C: 1, sum: 3 });
  },

  critical_error: async () => {
    const { A, B, C } = specObj();
    const t = sequence(spec()((p: 0) => [p, "A"] as const)("0"))
      .$(A, (x) => x["0"][1])
      .$(B, () => "B")
      .$(C, () => "C")
      .$(spec()((p: readonly number[]) => p.reduce((a, n) => a + n, 0))("sum"), (x) => [x.A, x.B, x.C])
      .$(
        spec()((p) => {
          throw p;
        })("err"),
        (x) => `error_sum:${x.sum}`,
      )
      .asSpec("seq");

    const r = run(t)(0);
    const re = res();
    const x = await r;
    x.state(re.add);

    let err: unknown;
    try {
      await x.promise;
    } catch (e) {
      err = e as never;
    }

    eq(x.state(), {
      _01: 0.8333333333333334,
      curr: 5,
      partial: { "0": [0, "A"], A: 1, B: 1, C: 1, sum: 3 },
      total: 6,
    });

    const e = ASSERT(ERR["critical"].is)(err);
    eq(e.ctx[0], "error_sum:3");
    eq(
      e.ctx[1].map((x) => x.spec.Id),
      ["err", "seq"], // trace
    );
  },

  recovery: async () => {
    const error = new Error("!");
    let errFromRun = __ as __ | ERR["critical"];

    const t = sequence(spec()(() => error as 0 | Error)("0"));
    const r0 = run(t.asSpec("!"))("!");

    let x: unknown;
    try {
      x = await (await r0).promise;
    } catch (e) {
      errFromRun = e as never;
    }
    eq(errFromRun, __); // not critical
    eq(x, error);

    const t2 = t.$(IO("A"), () => "A");
    eq(error as unknown, await (await run(t2.asSpec("t2"))("!")).promise);

    const t3 = t2
      .$(IO("B"), () => "B")
      ._(spec()((p: readonly [Error, Error]) => p)("recovered"), (e) => [e, e])
      .S(spec()(() => 1 as const)("NO_PARAM"));
    const x3 = await run(t3.asSpec("t3"))("!");
    eq(await x3.promise, { recovered: [error, error], NO_PARAM: 1 });
  },
}));

const results = {
  simple: [
    {
      _01: 0,
      curr: 0,
      partial: {},
      total: 5,
    },
    {
      _01: 0.2,
      curr: 1,
      partial: {
        "0": [0, "A"],
      },
      total: 5,
    },
    {
      _01: 0.4,
      curr: 2,
      partial: {
        "0": [0, "A"],
        A: 1,
      },
      total: 5,
    },
    {
      _01: 0.5, // B 50%
      curr: 2,
      partial: {
        "0": [0, "A"],
        A: 1,
      },
      total: 5,
    },
    {
      _01: 0.6,
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.65, // C 25%
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.7, // C 50%
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.75, // C 75%
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.8,
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
      _01: 1,
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
  ],
};

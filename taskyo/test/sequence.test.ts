import { describe } from "~testing";
import { __ } from "jsyoyo";

import { run, spec, ERR, sequence } from "../src";

import { IO, specObj } from "./multi.test";

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
        (x) => `sum:${x.sum}`,
      )
      .asSpec("1");

    const r = run(t)(0);
    const re = res();
    const x = await r;
    x.state(re.add);

    let err = {} as ERR["critical"]["$"];
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

    if (ERR["critical"].is(err)) {
      eq(err.ctx[0], "sum:3");
      eq(
        err.ctx[1].map((x) => x.spec.Id),
        ["!", "1"],
      );
    } else {
      throw "NOT_CRITICAL";
    }

    eq(err instanceof ERR["critical"]["$"], true);
  },

  recovery_0_step: async () => {
    const ERR = new Error("!");
    let err = __ as __ | ERR["critical"]["$"];

    const t = sequence(spec()(() => ERR as 0 | Error)("0"));
    const r0 = run(t.asSpec("!"))("!");

    let x: unknown;
    try {
      x = await (await r0).promise;
    } catch (e) {
      err = e as never;
    }
    eq(err, __);
    eq(x, ERR);

    const t2 = t.$(IO("A"), () => "A");
    eq(ERR as unknown, await (await run(t2.asSpec("t2"))("!")).promise);

    const t3 = t2
      .$(IO("B"), () => "B")
      ._(spec()((p: readonly [Error, Error]) => p)("OK"), (e) => [e, e])
      .S(spec()(() => 1 as const)("NO_PARAM"));
    const x3 = await run(t3.asSpec("t3"))("!");
    eq(await x3.promise, { OK: [ERR, ERR], NO_PARAM: 1 });
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
      _01: 0.7,
      curr: 3,
      partial: {
        "0": [0, "A"],
        A: 1,
        B: 1,
      },
      total: 5,
    },
    {
      _01: 0.75,
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

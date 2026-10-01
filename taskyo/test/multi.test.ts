import { describe } from "~testing";

import { __, a, AbortController, tick } from "jsyoyo";
import { Tree } from "treeo";
import { indexify } from "proyij";

import { run, choice, parallel, spec, ERR, Spec } from "../src";

export const IO = <ID extends string, Ticks extends number = 2>(I: ID, T = 2 as Ticks) =>
  spec(__, { curr: 0, total: T })<ID, Promise<number>>(async (p, _d, u) => {
    for (let i = 0; i < T; i++) {
      await tick();
      i && u({ curr: i }); // zero is the start value any way, so no point to report it twice
    }
    u({ curr: T });
    return p.length;
  })(I);

export const specs = () => [IO("A", 1), IO("B", 2), IO("C", 4)] as const;
export const specObj = <E extends Tree<Spec> = {}>(e = {} as E) => a(indexify("Id")(specs()), e);

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

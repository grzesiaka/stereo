import { describe } from "~testing";
import { __, AbortController, ifError, tick, THROW } from "jsyoyo";
import { run, choice, parallel, spec, ERR, Spec$Result } from "../src";
import { specs } from "./test-utils";

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
    let err: ERR["abort"] | Awaited<Spec$Result<typeof c>>;
    try {
      await tick(1);
      abort.abort();
      err = await rp.promise;
    } catch (e) {
      err = e as never;
    }

    ifError(err, (err) => eq(err.ctx[0], rp), THROW);
  },

  error: async () => {
    const s = choice([...specs(), spec()((p: "!") => Promise.reject(p))("!!")])("⨁");
    const abort = new AbortController();
    const r = await run(s)(["!!", "!"], abort.signal);

    let err = {} as ERR["critical"];
    try {
      await r.promise;
    } catch (e) {
      err = e as never;
    }

    ifError(
      err,
      (err) => {
        eq(err.name, "taskyo.error.critical");
        eq(err.ctx[0], "!");
        eq(err.ctx[1][1], r);
      },
      THROW,
    );
  },
}));

describe(`parallel`, ({ eq, res }) => ({
  simple: async () => {
    const ss = specs();
    const s = parallel(ss)("II", __, {});
    const r = await run(s)({ A: "A", B: "B", C: "C" });

    const pr = res();
    eq(r.state(), {
      "%": 0,
      curr: 0,
      total: 3,
      runs: {}, // TODO populate
    });

    r.state((x) => pr.add([x.curr, x.total, x["%"]]));
    eq(await r.promise, { A: 1, B: 1, C: 1 });

    pr.eq([
      [0, 3, 0],
      [1, 3, 33],
      [2, 3, 67],
      [3, 3, 100],
    ]);
  },
}));

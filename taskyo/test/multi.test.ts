import { describe } from "~testing";
import { run, choice, spec, ERR, Specs$ChoiceParams, Specs$ChoiceResult } from "../src";
import { __, AbortController, tick } from "jsyoyo";

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

describe(`ONLYchoice`, ({ eq, res }) => ({
  ONLYsimple_choice: async () => {
    const ts = specs();
    const c = choice(ts)("⨁");
    eq(c.__, ["⨁", ts]);
    type S = Specs$ChoiceParams<typeof ts>;
    type R = Specs$ChoiceResult<typeof ts>;
    const rp = await run(c)(["C", "C"]);
    console.log(rp);
    const re = res();

    const p = <N extends number>(curr: N) => ({ curr, total: 4, "⨁": "C" });

    const s0 = { curr: 0 };
    // eq(rp.state(), s0);

    rp.state((x) => {
      re.add(x);
      //   !x["⨁"] && eq(rp.state(), s0);
    });

    const r = await rp.promise;

    re.eq([s0, p(0), p(1), p(2), p(3), p(4)]);

    eq(r, 1);
  },

  abort: async () => {
    const c = choice(specs())("⨁");
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

    eq(ERR["abort"].is(err), true);
    // eq(err, rp.progress().failed);
  },

  error: async () => {
    const s = choice([...specs(), spec()((p: "!") => Promise.reject(p))("!!")])("⨁");
    const abort = new AbortController();
    const r = run(s)(["!!", "!"], abort.signal);

    let err = {} as ERR["critical"]["$"];
    try {
      await r;
    } catch (e) {
      err = e as never;
    }
    eq(ERR["critical"].is(err), true);
    // eq(err.cause.source, "!");
    // eq(err.taskIds, ["!!", "⨁"]);
    // eq(err.cause.progress.failed instanceof CriticalError, true);
  },
}));

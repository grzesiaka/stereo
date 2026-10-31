import { $describe, setupFakeTimers } from "~testing";

import { load, loop, spec } from "../src";
import { ifError, wait } from "jsyoyo";

$describe(setupFakeTimers)("replace", ({ res, v }) => ({
  sync: async () => {
    const r = res();
    let i = 1;
    const s_ = spec()(async (n: number) => {
      await wait(1);
      i += n;
      return i;
    })("");
    const s = await load(s_);

    const l = loop("replace")(s)();

    l.O((v) => {
      switch (v[0]) {
        case "+":
          r.add(["+", v[1].params]);
          break;
        case "-":
          r.add(["-", v[2].params, ifError(v[1], (e) => e.name)]);
          break;
      }
    });
    l.I(1);
    r.eq([["+", 1]]);
    await v.vi.advanceTimersByTimeAsync(1);
    r.eq([
      ["+", 1],
      ["-", 1, 2],
    ]);

    l.I(2);
    l.I(3);
    await v.vi.advanceTimersByTimeAsync(1);
    r.eq([
      ["+", 1],
      ["-", 1, 2],
      ["+", 2],
      ["+", 3],
      ["-", 2, "taskyo.error.abort"],
      ["-", 3, 7],
    ]);
  },
}));

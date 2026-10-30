import { $describe, setupFakeTimers } from "~testing";

import { loop, spec } from "../src";
import { wait } from "jsyoyo";

$describe(setupFakeTimers)("replace", ({ res, eq, v }) => ({
  sync: async () => {
    const x = res();
    let i = 1;
    const s = spec()(async (n: number) => {
      await wait(1);
      i += n;
      return i;
    })("");
    const l = loop("replace")(s)();
    // @ts-expect-error v[1].params
    l.O((v) => x.add([v[0], v[1].params || v[1]]));
    l.I(1);
    x.eq([]);
    await v.vi.advanceTimersByTimeAsync(1);
    x.eq([
      ["+", 1],
      ["-", 2],
    ]);

    l.I(2);
    l.I(3);
    await v.vi.advanceTimersByTimeAsync(1);
    x.eq([
      ["+", 1],
      ["-", 2],
      ["+", 2],
      ["+", 3],
    ]);
  },
}));

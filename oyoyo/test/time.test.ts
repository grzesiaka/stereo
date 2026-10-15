import { $describe, setupFakeTimers } from "~testing";
import { interval, map } from "../src";
import { DISPOSE } from "jsyoyo";

$describe(setupFakeTimers)(interval, ({ res, v }) => ({
  simple: () => {
    const r = res();
    const i = interval(20)(map((x) => x * x))(r.add);
    r.eq([]);
    v.vi.advanceTimersByTime(60);
    r.eq([0, 1 * 1, 2 * 2]);
    i.Y[DISPOSE]();
    v.vi.advanceTimersByTime(2000);
    r.eq([0, 1 * 1, 2 * 2]);
  },
}));

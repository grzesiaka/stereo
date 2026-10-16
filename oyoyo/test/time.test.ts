import { $describe, setupFakeTimers } from "~testing";
import { interval, map, tap, exe } from "../src";

$describe(setupFakeTimers)(interval, ({ res, v }) => ({
  simple: () => {
    const r = res();
    const dispose = interval(20)(
      map((x) => x * x),
      tap(r.add),
      exe(),
    );
    r.eq([]);
    v.vi.advanceTimersByTime(60);
    r.eq([0, 1 * 1, 2 * 2]);
    dispose();
    v.vi.advanceTimersByTime(2000);
    r.eq([0, 1 * 1, 2 * 2]);
  },
}));

import { $describe, setupFakeTimers } from "~testing";
import { interval, map, tap, exe, val } from "../src";
import { delay } from "../src/time/delay";

$describe(setupFakeTimers)("time", ({ res, v }) => ({
  interval: () => {
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

  delay: () => {
    const r = res();
    const add = tap(r.add);
    const dispose = val(1)(delay(1), add, delay(1), add, exe());
    r.eq([]);
    v.vi.advanceTimersByTime(1);
    r.eq([1]);
    v.vi.advanceTimersByTime(1);
    r.eq([1, 1]);
    dispose();
  },
}));

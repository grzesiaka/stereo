import { describe, $describe, setupFakeTimers } from "~testing";
import { wrap, event, map, exe, take, delay } from "../src";

describe(wrap, ({ eq, res }) => ({
  simple: () => {
    const r = res();
    const { I } = event<number>()(
      wrap(($, idx) => $(map((x) => x * idx))),
      exe(r.add),
    );
    r.eq([]);
    I(0);
    r.eq([0]);
    I(1);
    r.eq([0, 1]);
    I(2);
    r.eq([0, 1, 4]);
  },

  prev_completed: () => {
    const r = res();
    const { I, Z } = event<number>()(
      wrap(($, idx) => $(map((x) => x * idx))),
      take(2),
      exe(r.add),
    );

    eq(Z.__, ["take", 2]);
    Z.Z(() => r.add("DONE"));

    r.eq([]);
    I(0);
    r.eq([0]);
    I(1);
    r.eq([0, 1, "DONE"]);

    I(2); // no effect
    r.eq([0, 1, "DONE"]);
  },
}));

$describe(setupFakeTimers)(wrap, ({ v, res, eq }) => ({
  concurrency: () => {
    const r = res();
    const { I, Y } = event<number>()(
      wrap(
        ($, idx) =>
          $(
            map((x) => x * idx),
            delay(idx),
          ),
        2,
      ),
      exe(r.add),
    );

    r.eq([]);
    I(0);
    r.eq([]);
    I(1);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 2);
    I(2);
    I(3);
    I(4);
    eq(Y.pending.length, 3);
    eq(Y.running.length, 2);
    r.eq([]);
    v.vi.advanceTimersByTime(0);
    r.eq([0]);
    eq(Y.pending.length, 2);
    eq(Y.running.length, 2);
    v.vi.advanceTimersByTime(2);
    r.eq([0, 1, 4]);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 2);
    v.vi.advanceTimersByTime(2);
    r.eq([0, 1, 4, 9]);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 1);
    v.vi.advanceTimersByTime(2);
    r.eq([0, 1, 4, 9, 16]);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 0);
  },
}));

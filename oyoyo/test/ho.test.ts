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
  concurrency_no_completion: () => {
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
    eq(Y.pending.length, 1);
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
    v.vi.advanceTimersByTime(2); // 6 = 2 waiting / pending + 4 delay
    r.eq([0, 1, 4, 9, 16]);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 0);
  },

  concurrency_completion_before_wrap: () => {
    const r = res();
    const { I, Y, Z } = event<number>()(
      take(4),
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
    Y.Y.Z(() => r.add("TAKE_DONE"));
    Z.Z(() => r.add("ALL_DONE"));

    r.eq([]);
    I(0);
    r.eq([]);
    I(1);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 2);
    I(2);
    eq(Y.pending.length, 1);
    I(3);
    r.eq(["TAKE_DONE"]);
    I(4); // does not go through take
    eq(Y.pending.length, 2);
    eq(Y.running.length, 2);

    v.vi.advanceTimersByTime(0);
    r.eq(["TAKE_DONE", 0]);
    eq(Y.pending.length, 1);
    eq(Y.running.length, 2);
    v.vi.advanceTimersByTime(2);
    r.eq(["TAKE_DONE", 0, 1, 4]);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 1);
    v.vi.advanceTimersByTime(2);
    r.eq(["TAKE_DONE", 0, 1, 4, 9, "ALL_DONE"]);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 0);
  },

  concurrency_completion_after_wrap: () => {
    const r = res();
    const x = event<number>()(
      take(4),
      wrap(
        ($, idx) =>
          $(
            map((x) => x * idx),
            delay(idx),
          ),
        2,
      ),
      take(3),
      exe(r.add),
    );
    const I = x.I;
    const Y = x.Y.Y;

    Y.Y.Z(() => r.add("TAKE_DONE"));
    x.Y.Z(() => r.add("ALL_DONE"));

    r.eq([]);
    I(0);
    r.eq([]);
    I(1);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 2);
    I(2);
    eq(Y.pending.length, 1);
    I(3);
    r.eq(["TAKE_DONE"]);
    I(4); // does not go through take
    eq(Y.pending.length, 2);
    eq(Y.running.length, 2);

    v.vi.advanceTimersByTime(0);
    r.eq(["TAKE_DONE", 0]);
    eq(Y.pending.length, 1);
    eq(Y.running.length, 2);
    v.vi.advanceTimersByTime(2);
    r.eq(["TAKE_DONE", 0, 1, 4, "ALL_DONE"]);
    eq(Y.pending.length, 0);
    eq(Y.running.length, 1);
    // v.vi.advanceTimersByTime(2);
    // r.eq(["TAKE_DONE", 0, 1, 4, 9,]);
    // eq(Y.pending.length, 0);
    // eq(Y.running.length, 0);
  },
}));

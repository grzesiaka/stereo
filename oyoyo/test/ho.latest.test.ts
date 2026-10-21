import { describe, $describe, setupFakeTimers } from "~testing";
import { latest, event, map, exe, take, delay } from "../src";
import { __ } from "jsyoyo";

describe(latest, ({ eq, res }) => ({
  simple: () => {
    const r = res();
    const { I } = event<number>()(
      latest(($, idx) => $(map((x) => x * idx))),
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
      latest(($, idx) => $(map((x) => x * idx))),
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

$describe(setupFakeTimers)(latest, ({ v, res, eq }) => ({
  concurrency_no_completion: () => {
    const r = res();
    const { I, Y } = event<number>()(
      latest(($, idx) =>
        $(
          map((x) => x * idx),
          delay(idx),
        ),
      ),
      exe(r.add),
    );

    r.eq([]);
    I(0);
    r.eq([]);
    eq(Y.current!.__, ["delay", 0]);
    I(1);
    r.eq([]);
    eq(Y.current!.__, ["delay", 1]);
    v.vi.advanceTimersByTime(1);
    I(2);
    r.eq([1]);
    eq(Y.current!.__, ["delay", 2]);
    I(3);
    I(4);
    eq(Y.current!.__, ["delay", 4]);
    v.vi.advanceTimersByTime(4);
    r.eq([1, 16]);
  },

  concurrency_completion_before_latest: () => {
    const r = res();
    const { I, Y, Z } = event<number>()(
      take(4),
      latest(($, idx) =>
        $(
          map((x) => x * idx),
          delay(idx),
        ),
      ),
      exe(r.add),
    );
    Y.Y.Z(() => r.add("TAKE_DONE"));
    Z.Z(() => r.add("ALL_DONE"));

    r.eq([]);
    I(0);
    r.eq([]);
    eq(Y.current!.__, ["delay", 0]);
    I(1);
    r.eq([]);
    eq(Y.current!.__, ["delay", 1]);
    v.vi.advanceTimersByTime(1);
    I(2);
    r.eq([1]);
    eq(Y.current!.__, ["delay", 2]);
    I(3);
    r.eq([1, "TAKE_DONE"]);
    eq(Y.current!.__, ["delay", 3]);

    I(4); // no effect
    v.vi.advanceTimersByTime(4);
    r.eq([1, "TAKE_DONE", 9, "ALL_DONE"]);
  },

  concurrency_completion_after_latest: () => {
    const r = res();
    const x = event<number>()(
      take(4),
      latest(($, idx) =>
        $(
          map((x) => x * idx),
          delay(idx),
        ),
      ),
      take(1),
      exe(r.add),
    );
    const I = x.I;
    const Y = x.Y.Y;

    Y.Y.Z(() => r.add("TAKE_DONE"));
    x.Y.Z(() => r.add("ALL_DONE"));

    r.eq([]);
    I(0);
    r.eq([]);
    eq(Y.current!.__, ["delay", 0]);
    I(1);
    r.eq([]);
    eq(Y.current!.__, ["delay", 1]);
    v.vi.advanceTimersByTime(1);
    r.eq([1, "ALL_DONE"]);
    I(2); // TODO once done should not accept new values
    v.vi.advanceTimersByTime(1);
    r.eq([1, "ALL_DONE"]);
    eq(Y.current, __);
  },
}));

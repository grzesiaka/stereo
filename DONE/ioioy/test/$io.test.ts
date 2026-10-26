import { $describe, setupFakeTimers, describe } from "~testing";
import { $IO } from "../src";
import { Dispose, DISPOSE } from "disposyo";
import { MsOrNumber, timeout } from "jsyoyo";

describe("sync", ({ eq, res, v }) => ({
  count: () => {
    const io = $IO(() => 0)<unknown[], number>((O, X, I) => I((x) => O(X(X() + x.length))))("count");
    eq(io.O.Id, "count");
    eq(io.X, 0);

    const r = res();
    io.O(r.add);
    r.eq([]);

    io.I(["a"]);
    eq(io.X, 1);
    r.eq([1]);

    io.I(["a", "b"]);
    eq(io.X, 3);
    r.eq([1, 3]);

    io[DISPOSE]();
    io.I(["a", "b"]);
    eq(io.X, 3);
    r.eq([1, 3]);
  },
}));

$describe(setupFakeTimers)("effects", ({ v, res }) => ({
  timers: () => {
    const io = $IO(() => new Set<Dispose>())<[MsOrNumber, string], string>((O, X, I) => {
      I(([ms, v]) => {
        const d = timeout(ms, () => {
          X().delete(d);
          O(v);
        });
        X().add(d);
      });
      return () => X().forEach((d) => d());
    })("delay");

    const r = res();
    io.O(r.add);
    r.eq([]);

    io.I([1, "1"]);
    io.I([2, "2"]);
    io.I([3, "3"]);
    v.vi.advanceTimersByTime(1);
    r.eq(["1"]);
    v.vi.advanceTimersByTime(1);
    r.eq(["1", "2"]);
    io[DISPOSE]();
    v.vi.advanceTimersByTime(1);
    r.eq(["1", "2"]);
  },
}));

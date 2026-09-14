import { describe } from "~testing";

import { ON, sEmit, __, AbortController, AbortError } from "../src";
import { timeout, wait } from "../src/time";

describe(sEmit, ({ eq, res }) => ({
  "/": () => {
    const { emit, $, CBs: listners } = sEmit<{ a: ["A"]; b: ["b" | "B"] }>();
    const r = res();
    $.on("a", (x) => r.add(["a", x]));
    eq(listners.a!.size, 1);
    eq(listners.b, __);
    const on_b = (x: unknown) => r.add(["b", x]);
    $.on("b", on_b);
    r.eq([]);
    emit("a", "A");
    emit("b", "B");
    r.eq([
      ["a", "A"],
      ["b", "B"],
    ]);
    $.off("b", on_b);
    emit("a", "A");
    emit("b", "B");
    r.eq([
      ["a", "A"],
      ["b", "B"],
      ["a", "A"],
    ]);
  },
}));

describe(ON, ({ eq, res }) => ({
  "/": () => {
    const { emit, $, CBs } = sEmit<{ a: ["A"]; b: ["b" | "B"] }>();
    const r = res();
    const on = ON($);
    on("a", (x) => r.add(["a", x]));
    eq(CBs.a!.size, 1);
    eq(CBs.b, __);
    const off_b = on("b", (x) => r.add(["b", x]));
    r.eq([]);
    emit("a", "A");
    emit("b", "B");
    r.eq([
      ["a", "A"],
      ["b", "B"],
    ]);
    off_b();
    emit("a", "A");
    emit("b", "B");
    r.eq([
      ["a", "A"],
      ["b", "B"],
      ["a", "A"],
    ]);
  },
  ONCE: () => {
    const { emit, $, CBs } = sEmit<{ a: ["A"]; b: ["b" | "B"] }>();
    const r = res();
    const on = ON.CE($);
    on("a", (x) => r.add(["a", x]));
    r.eq([]);
    emit("a", "A");
    eq(CBs.a, __);
    emit("a", "A");
    r.eq([["a", "A"]]);
  },
}));

describe(wait, ({ eq }) => ({
  wait: async () => eq(1, await wait(0, 1)),
  aborted: async () => {
    const abort = new AbortController();

    let err = __ as unknown;
    try {
      timeout(0, () => abort.abort());
      await wait(1, __, abort.signal);
    } catch (e) {
      err = e;
    }

    eq(err instanceof AbortError, true);
    eq((err as AbortError).signal, abort.signal);
  },

  not_aborted: async () => {
    const abort = new AbortController();

    let err = __ as unknown;
    try {
      timeout(2, () => abort.abort());
      eq(1, await wait(0, 1));
    } catch (e) {
      err = e;
    }
    eq(abort.signal.aborted, __); // Weirdly if timeout(1,...) it is true
    eq(err, __);

    await wait(1); // timing is pretty tight - not sure if there might be some race conditions involved...
    eq(abort.signal.aborted, true);
  },
}));

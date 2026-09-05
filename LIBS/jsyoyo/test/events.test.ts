import { describe } from "~testing";

import { ON, sEmit, __ } from "../src";

describe(sEmit, ({ eq, res }) => ({
  "/": () => {
    const { emit, $, listners } = sEmit<{ a: ["A"]; b: ["b" | "B"] }>();
    const r = res();
    $.on("a", (x) => r.add(["a", x]));
    eq(listners.a!.size, 1);
    eq(listners.b, __);
    const off_b = $.on("b", (x) => r.add(["b", x]));
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
}));

describe(ON, ({ eq, res }) => ({
  "/": () => {
    const { emit, $, listners } = sEmit<{ a: ["A"]; b: ["b" | "B"] }>();
    const r = res();
    const on = ON($);
    on("a", (x) => r.add(["a", x]));
    eq(listners.a!.size, 1);
    eq(listners.b, __);
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
}));

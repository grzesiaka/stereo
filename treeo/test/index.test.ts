import { describe, test, expect } from "vitest";
import mapTree from "../src/map";

const t = {
  a: "B",
  c: { d: "E", f: () => 1 as const, g: [] },
} as const;

describe("mapTree", () => {
  test("{}", () => {
    const m = mapTree({})(() => 1);
    expect(m).toEqual({});
  });

  test("count", () => {
    let i = 0;
    const m = mapTree(t)(() => ++i);
    expect(m).toEqual({ a: 1, c: { d: 2, f: 3, g: 4 } });
  });

  test("path", () => {
    const m = mapTree(t)((x) => x[1]);
    expect(m).toEqual({ a: "a", c: { d: "c.d", f: "c.f", g: "c.g" } });
  });

  test("switch on key", () => {
    const m = mapTree(t)((vk) => {
      switch (vk[1]) {
        case "a":
          return vk[0];
        case "c.d":
          return "D";
        case "c.f":
          return vk[0]();
        case "c.g":
          return "ABC";
      }
    });
    expect(m).toEqual({ a: "B", c: { d: "D", f: 1, g: "ABC" } });
  });
});

// describe("_L/context", () => {
//   test("[]", () => {
//     const R = L()({ o: { a: () => 1, b: () => "" } });
//     expect(R.o.a()).toEqual(1);
//     expect(R.o.a._L).toEqual(["o.a"]);
//   });

//   const CTX = [{ L: ["L"] }, "0-1"] as const;
//   test("[L]", () => {
//     const R = L(...CTX)((L, r) => [L, r] as const);
//     expect(R._L).toEqual([...CTX, ""]);
//     expect(R()).toEqual(CTX);
//   });

//   test("[L]/deeper", () => {
//     const R = L(...CTX)({ c: { a: (L) => L.L, b: (...L) => L.length } });
//     expect(R.c.a._L).toEqual([...CTX, "c.a"]);
//     // @ts-expect-error
//     R.c.a._L[0].L = ["R"];
//     expect(R.c.a()).toEqual(["R"]);
//   });

//   test("[L]/paths0", () => {
//     const R = L()({ a: (k) => k, b: { c: (k) => k } });
//     expect(R.a()).toEqual("a");
//   });
// });

// describe("2entries", () => {
//   test("empty", () => expect(tree2vks({})).toStrictEqual([]));
//   test("deeper", () => {
//     const e = tree2vks(mapTree(t)((x) => x[1]));
//     // @ts-expect-error "1" should be "a"
//     let f: typeof e = [["a", "1"]];
//     f = [
//       ["a", "a"],
//       ["c.d", "c.d"],
//       ["c.f", "c.f"],
//       ["c.g", "c.g"],
//     ];
//     expect(e).toEqual(f);
//   });
// });

// describe("_X/execute", () => {
//   test("1", () => expect(eXe(() => 1)).toBe(1));
//   test("deeper", () => expect(eXe({ a: () => 1, b: { c: () => "c" } })).toEqual({ a: 1, b: { c: "c" } }));
// });

// describe("cmdify", () => {
//   test("simple", () => {
//     const t = { a: (x: number) => [x, x] as [number, number], b: { c: (x: number, y: string) => `${x} !? ${y}` } };
//     const c = cmdify(t);
//     const r = c.a(0)(c.a(1)(), c.b.c(0, "1")());
//     const e = [
//       "a",
//       [0],
//       [
//         ["a", [1], []],
//         ["b.c", [0, "1"], []],
//       ],
//     ];
//     expect(r).toStrictEqual(e);
//   });
// });

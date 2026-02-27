import { describe, test, expect } from "vitest";

import { IN, F, Fify, UP } from "./y";
import { __ } from "./0";

describe("IN / Input", () => {
  test("IN", () => {
    const i = IN(7)();
    const re = [] as unknown[];
    const x = i((x) => re.push(x));
    x.i(2);
    expect(re).toStrictEqual([7, 2]);
  });
});

describe("F / partial map", () => {
  test("a simple flow", () => {
    const id = <X>(x: X) => x;
    const toString = Fify(<X>(n: X) => `${n}`);
    const i = IN(1, "i")(
      toString,
      F(parseFloat),
      F((x) => [x, x]),
      F(id),
      UP(() => ({ id: "UPPED" })),
    );

    const re = [] as (readonly [number, number])[];
    const x = i((x) => re.push(x));

    x.p.p.p.p.i(2);
    expect(x.id).toBe("UPPED");
    expect(x.p.p.p.p.id).toBe("i");
    expect(re).toStrictEqual([
      [1, 1], // initial value
      [2, 2], // above call .i(2)
    ]);
  });

  test("undefined (aka __) are ignored by default (via default id transform)", () => {
    const i = IN(__ as __<number>)(F());
    const re = [] as unknown[];
    const x = i((x) => re.push(x));
    x.p.i(7);
    x.p.i(undefined);
    expect(re).toStrictEqual([7]);
  });

  test("reference to previous", () => {
    const f = (x: unknown) => x;
    const i = IN(1, "1")(F(f)) as any;
    expect(i.__.slice(0, 2)).toStrictEqual([[f], "F"]);
    expect(i.__[2].__).toStrictEqual([[1, "1"], "IN"]);
    const x = i((x: 1) => x);
    expect(x.__.slice(0, 2)).toStrictEqual([[f], "F"]);
    expect(x.p.__).toStrictEqual([[1, "1"], "IN"]);
  });
});

import { describe, test, expect } from "vitest";

import { IN, F, UP, S } from "./y";
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
    const toString = <X>(n: X) => `${n}`;
    const toStringF = F.ify(toString);
    const i = IN.L({ a: "A", toString, dup: <X>(x: X) => [x, x] as [X, X] })(1, "i")(
      toStringF,
      F(parseFloat),
      F((x) => [x, x]),
      F(id),
      UP(() => ({ id: "UPPED" })),
      F.L(($) => $.dup),
      F("toString"),
      // F('a')
    );

    const re = [] as string[];
    const x = i((x) => re.push(x));

    x.p.p.p.p.p.p.i(2);
    expect(x.p.p.id).toBe("UPPED");
    expect(x.p.p.p.p.p.p.id).toBe("i");
    expect(re).toStrictEqual(["1,1,1,1", "2,2,2,2"]);
  });

  test("undefined (aka __) are ignored by default (via default id transform)", () => {
    const i = IN(__ as __<number>)(F());
    const re = [] as unknown[];
    const x = i((x) => re.push(x));
    x.p.i(7);
    x.p.i(undefined);
    expect(re).toStrictEqual([7]);
  });
});

describe("S / Scan", () => {
  test("simple", () => {
    const empty = () => "";
    const add = (a: number, b: number) => a + b;
    const i = IN.L([empty, add])(0)(
      F((x) => x * x),
      S((v, s: __<number>, [_, add]) => add(v, s || 0)),
      S(
        ([e]) => e(),
        (v, s) => [s, `${v}`].filter(Boolean).join(";"),
      ),
    );
    const re = [] as unknown[];
    const x = i((x) => re.push(x));
    x.p.p.p.i(1);
    x.p.p.p.i(2);
    expect(re).toStrictEqual(["0", "0;1", "0;1;5"]);
  });
});

describe("meta", () => {
  test("reference to previous", () => {
    const f = (x: unknown) => x;
    const i = IN(1, "1")(F(f)) as any;
    expect(i.__[0]()).toStrictEqual(f);
    expect(i.__[2].__).toStrictEqual([1, "IN"]);
    const x = i((x: 1) => x);
    expect(x.__[0]()).toStrictEqual(f);
    expect(x.p.__).toStrictEqual([1, "IN"]);
  });
});

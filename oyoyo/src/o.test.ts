import { describe, test, expect } from "vitest";

import o from "./o";
import { __, Fn } from "./0";

const P = <X>(x: X) => Promise.resolve(x);
const IP = (x: number) => P(x + 1);
const I = (x: number) => x + 1;

describe("o / compose async", () => {
  const L = { L: "L" as const };
  const y = o.$(L);

  test("no type & no initial value", async () => {
    const type0value0 = y();

    const xL = type0value0();
    expect(xL).toStrictEqual([__, L]);

    const _1 = type0value0((x) => x);
    expect(await _1(_1)).toBe(_1);
    expect(_1.length).toBe(1);
  });

  test("undefined type & no initial value", async () => {
    const N = y<__<number>>();
    const xL = N();
    expect(xL).toStrictEqual([__, L]);

    const _1 = N(IP);
    expect(await _1(1)).toBe(2);

    const _2 = N(IP, IP);
    expect(await _2(2)).toBe(4);

    const _3 = N(IP, I, IP);
    expect(await _3(3)).toBe(6);

    const _4 = N(IP, IP, I, IP);
    expect(await _4(4)).toBe(8);

    const _5 = N(IP, IP, I, IP, IP);
    expect(await _5(5)).toBe(10);

    const _6 = N(IP, IP, I, IP, IP, IP);
    expect(await _6(6)).toBe(12);

    const _7 = N(IP, IP, I, IP, IP, IP, IP);
    expect(await _7(7)).toBe(14);

    const _8 = N(IP, IP, I, IP, IP, IP, IP, IP);
    expect(await _8(8)).toBe(16);
  });

  test("no type & undefined initial value", async () => {
    const O = y(__ as __<typeof o>); // better would be: y<__<typeof c>>()
    const xL = O();
    expect(xL).toStrictEqual([__, L]);
    const dup = O((x) => P([x, x]));

    expect(await dup(o)).toStrictEqual([o, o]);

    // @ts-expect-error no initial value => must be provided when running
    dup();
  });
});

describe("errors", () => {
  class StopError<X> extends Error {
    constructor(public readonly x: X) {
      super();
    }
  }

  const STOP = <X>(x = 0 as X) => new StopError(x);

  const y = o.$(STOP)<number>(0);

  test("stop", async () => {
    const x = y(
      I,
      IP,
      (x, s) => (x > 7 ? s(7) : x),
      (x) => `${x}${x + 1}`,
      (x, s) => (x === "67" ? s("67?!") : x),
      (x) => [x, x],
    );

    expect(await x()).toStrictEqual(["23", "23"]);
    expect(await x(6)).toStrictEqual([STOP(7), [6, 7, 8]]);
    expect(await x(4)).toStrictEqual([STOP("67?!"), [4, 5, 6, 6, "67"]]);
  });
});

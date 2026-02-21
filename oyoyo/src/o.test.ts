import { describe, test, expect } from "vitest";

import o from "./o";
import { __ } from "./0";

describe("o / compose async", () => {
  const L = { L: "L" as const };
  const y = o.$(L);
  const P = <X>(x: X) => Promise.resolve(x);

  test("no type & no initial value", async () => {
    const type0value0 = y();

    const unknown2unknown = type0value0();
    expect(await unknown2unknown(0)).toBe(0);

    // @ts-expect-error no initial value => must be provided when running
    unknown2unknown();

    const _1 = type0value0((x) => x);
    expect(await _1(_1)).toBe(_1);
    expect(_1.length).toBe(1);
  });

  test("undefined type & no initial value", async () => {
    const N = y<__<number>>();
    const number2number = N();
    // @ts-expect-error number expected
    number2number("");
    expect(await number2number(1)).toBe(1);

    const I = (x: number) => P(x + 1);

    const _1 = N(I);
    expect(await _1(1)).toBe(2);

    const _2 = N(I, I);
    expect(await _2(2)).toBe(4);

    const _3 = N(I, I, I);
    expect(await _3(3)).toBe(6);

    const _4 = N(I, I, I, I);
    expect(await _4(4)).toBe(8);

    const _5 = N(I, I, I, I, I);
    expect(await _5(5)).toBe(10);

    const _6 = N(I, I, I, I, I, I);
    expect(await _6(6)).toBe(12);

    const _7 = N(I, I, I, I, I, I, I);
    expect(await _7(7)).toBe(14);

    const _8 = N(I, I, I, I, I, I, I, I);
    expect(await _8(8)).toBe(16);
  });

  test("no type & undefined initial value", async () => {
    const O = y(__ as __<typeof o>); // better would be: y<__<typeof c>>()
    const o2o = O();
    const dup = O((x) => P([x, x]));

    expect(await dup(o)).toStrictEqual([o, o]);

    // @ts-expect-error incorrect type
    o2o("");
    // @ts-expect-error no initial value => must be provided when running
    dup();
  });

  // test("no type & defined initial value", async () => {
  //   const yyy = y(y(y));
  //   const C = y(yyy); // Compose<Compose<Compose<$Compose<...>>>>
  //   const i = C((y) => P(y()()()()()));

  //   const unknown2unknown = (await i(y(y(y))))();
  //   expect(unknown2unknown(y)).toBe(y);

  //   // @ts-expect-error incorrect type
  //   i(y(y));
  //   // @ts-expect-error incorrect type (bit different)
  //   i(y(y)(y));
  // });
  test("type & defined initial value", async () => {
    const x = y<0>(0);
    expect(x.length).toBe(0);
    expect(await x()()).toBe(0);
    // @ts-expect-error 1 instead of zero, but id works as expected
    expect(await x()(1)).toBe(1);

    // @ts-expect-error
    y<"x">("y");
  });
});

import { describe, test, expect } from "vitest";

import c from "./c";
import { __ } from "./0";

describe("c / compose", () => {
  const L = { L: "L" as const };
  const y = c.$(L);

  test("no type & no initial value", () => {
    const type0value0 = y();

    const unknown2unknown = type0value0();
    expect(unknown2unknown(0)).toBe(0);

    // @ts-expect-error no initial value => must be provided when running
    unknown2unknown();

    const _1 = type0value0((x) => x);
    expect(_1(_1)).toBe(_1);
    expect(_1.length).toBe(1);
  });

  test("undefined type & no initial value", () => {
    const N = y<__<number>>();
    const number2number = N();
    // @ts-expect-error number expected
    number2number("");
    expect(number2number(1)).toBe(1);

    const I = (x: number) => x + 1;

    const _1 = N(I);
    expect(_1(1)).toBe(2);

    const _2 = N(I, I);
    expect(_2(2)).toBe(4);

    const _3 = N(I, I, I);
    expect(_3(3)).toBe(6);

    const _4 = N(I, I, I, I);
    expect(_4(4)).toBe(8);

    const _5 = N(I, I, I, I, I);
    expect(_5(5)).toBe(10);

    const _6 = N(I, I, I, I, I, I);
    expect(_6(6)).toBe(12);

    const _7 = N(I, I, I, I, I, I, I);
    expect(_7(7)).toBe(14);

    const _8 = N(I, I, I, I, I, I, I, I);
    expect(_8(8)).toBe(16);
  });

  test("no type & undefined initial value", () => {
    const C = y(__ as __<typeof c>); // better would be: y<__<typeof c>>()
    const c2c = C();
    const dup = C((x) => [x, x]);

    expect(dup(c)).toStrictEqual([c, c]);

    // @ts-expect-error incorrect type
    c2c("");
    // @ts-expect-error no initial value => must be provided when running
    dup();
  });

  test("no type & defined initial value", () => {
    const yyy = y(y(y));
    const C = y(yyy); // Compose<Compose<Compose<$Compose<...>>>>
    const i = C((y) => y()()()()());

    const unknown2unknown = i(y(y(y)))();
    expect(unknown2unknown(y)).toBe(y);

    // @ts-expect-error incorrect type
    i(y(y));
    // @ts-expect-error incorrect type (bit different)
    i(y(y)(y));
  });
  test("type & defined initial value", () => {
    const x = y<0>(0);
    expect(x.length).toBe(0);
    expect(x()()).toBe(0);
    // @ts-expect-error 1 instead of zero, but id works as expected
    expect(x()(1)).toBe(1);

    // @ts-expect-error
    y<"x">("y");
  });
});

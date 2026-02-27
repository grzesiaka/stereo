import { describe, test, expect } from "vitest";

import p from "./p";
import { __ } from "./0";

describe("p / pipe", () => {
  test("0-16", () => {
    const N = p;
    expect(N(0)()).toStrictEqual(0);

    const I = (x: number) => x + 1;

    expect(p(1)(I)).toBe(2);
    expect(p(2)(I, I)).toBe(4);
    expect(p(3)(I, I, I)).toBe(6);
    expect(p(4)(I, I, I, I)).toBe(8);
    expect(p(5)(I, I, I, I, I)).toBe(10);
    expect(p(6)(I, I, I, I, I, I)).toBe(12);
    expect(p(7)(I, I, I, I, I, I, I)).toBe(14);
    expect(p(8)(I, I, I, I, I, I, I, I)).toBe(16);
    expect(p(9)(I, I, I, I, I, I, I, I, I)).toBe(18);
    expect(p(10)(I, I, I, I, I, I, I, I, I, I)).toBe(20);
    expect(p(11)(I, I, I, I, I, I, I, I, I, I, I)).toBe(22);
    expect(p(12)(I, I, I, I, I, I, I, I, I, I, I, I)).toBe(24);
    expect(p(13)(I, I, I, I, I, I, I, I, I, I, I, I, I)).toBe(26);
    expect(p(14)(I, I, I, I, I, I, I, I, I, I, I, I, I, I)).toBe(28);
    expect(p(15)(I, I, I, I, I, I, I, I, I, I, I, I, I, I, I)).toBe(30);
    expect(p(16)(I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I)).toBe(32);
  });

  test("L / context", () => {
    expect(p(p)()).toBe(p);

    const L = [{ p }, "?"] as const;
    expect(p(0, ...L)()).toStrictEqual([0, ...L]);

    expect(p(0, ...L)((_, { p }, q) => p(q))()).toBe("?");
    expect(p(0, ...L)((_, { p }, q) => p(q)())).toBe("?");
    expect(p(0, ...L)((_, { p }, q) => p(q, ...L)())).toStrictEqual(["?", ...L]);
    expect(p(0, ...L)((_, { p }, q) => p(q, ...L))()).toStrictEqual(["?", ...L]);
  });
});

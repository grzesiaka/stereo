import { describe, test, expect } from "vitest";

import { I, F, UP } from "./y";

describe("yR / initial values", () => {
  test("I", () => {
    const i = I(1)();
    const re = [] as unknown[];
    const x = i((x) => re.push(x));
    x.i(2);
    expect(re).toStrictEqual([1, 2]);
  });
});

describe("yR / partial map", () => {
  test(() => {
    const id = <X>(x: X) => x;
    const toString = F.ify(<X>(n: X) => `${n}`);
    const i = I(1)(
      toString,
      F((x) => `${x}`),
      F((x) => [x, x]),
      F(id),
      UP(() => ({ id: "??" })),
    );
    const re = [] as (readonly [string, string])[];
    const x = i((x) => re.push(x));
    x.p.p.p.p.i(2);
    expect(re).toStrictEqual([
      ["1", "1"], // initial value
      ["2", "2"], // above call .i(2)
    ]);
  });
});

import { describe, test, expect } from "vitest";

import o from "./o";
import { __ } from "./0";

describe("o", () => {
  test("\0", () => {
    const L = { L: "L" as const };
    const no = o.$(L)();
    expect(no()).toBe(L);
    const noT = o.$(L)<__<"?">>();
    expect(noT()).toBe(L);
    const noV = o.$(L)(__("?"))(
      (x) => x,
      () => "!" as const,
    );
    expect(noV("?")).toBe("!");
    const noTV = o.$(L)<__<"?">>("?");
    expect(noTV((x) => x)("?")).toBe("?");
    const v = o.$(L)("!")(
      (x) => [x, x] as const,
      (x, L, p) => [x, L, [...p]],
    )();
    expect([["!", "!"], L, ["!", ["!", "!"]]]).toStrictEqual(v);
  });
});

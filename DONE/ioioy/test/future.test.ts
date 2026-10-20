import { describe } from "~testing";

import { Future, ifResolved } from "../src";

const resolved = <F extends object>(F: F) =>
  ifResolved(
    F,
    () => "OK" as const,
    () => "PENDING" as const,
  );

describe(Future, ({ eq }) => ({
  once: () => {
    const f = Future.$1<number>();
    eq(resolved(f), "PENDING");
    f.I(1);
    eq(resolved(f), "OK");
    eq(f.X, 1);

    f.I(2); // no effect
    eq(resolved(f), "OK");
    eq(f.X, 1);
  },

  multi: () => {
    const f = Future.$<number>();
    eq(resolved(f), "PENDING");
    f.I(1);
    eq(resolved(f), "OK");
    eq(f.X, 1);

    f.I(2); // no effect
    eq(resolved(f), "OK");
    eq(f.X, 2);
  },
}));

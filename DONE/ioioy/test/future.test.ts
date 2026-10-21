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
    let x = 0;
    f.O((i) => (x = i));
    eq(x, 0);
    eq(resolved(f), "PENDING");

    f.I(1);
    eq(x, 1);
    eq(resolved(f), "OK");
    eq(f.X, 1);

    f.I(2); // no effect, since # = 1
    eq(x, 1);
    eq(resolved(f), "OK");
    eq(f.X, 1);
  },

  multi: () => {
    const f = Future.$<number>();
    let x = 0;
    f.O((i) => (x = i));
    eq(resolved(f), "PENDING");
    eq(x, 0);

    f.I(1);
    eq(x, 1);
    eq(resolved(f), "OK");
    eq(f.X, 1);

    f.I(2);
    eq(x, 2);
    eq(resolved(f), "OK");
    eq(f.X, 2);
  },
}));

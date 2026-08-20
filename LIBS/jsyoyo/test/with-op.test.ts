import { describe } from "~testing";
import { asOPs, $asOPs } from "../src/with-op";

describe(asOPs, ({ eq }) => ({
  implicit: () => {
    const fs = {
      a: () => ({}),
      b: (n: {}) => n,
    };
    const ops = asOPs(fs);
    const a = ops.a();
    const p = {};
    const b = ops.b(p);
    // @ts-expect-error implicitly __ is not defined
    eq(a.__, ["a", []]);
    // @ts-expect-error implicitly __ is not defined
    eq(b.__, ["b", [p]]);
  },

  explicit: () => {
    const fs = {
      a: () => ({}),
      b: <N extends {}>(n: N) => n,
    };
    const ops = $asOPs<false>()(fs);
    const a = ops.a();
    const p = { a: "A" };
    const b = ops.b(p);
    eq(a.__, ["a", []]);
    eq(b.__, ["b", [p]]);
  },
}));

import { describe } from "~testing";
import { dethunk } from "../src/fun";

describe(dethunk, ({ eq }) => ({
  0: () => {
    eq(dethunk(0), 0);
    eq(
      dethunk(() => 0),
      0,
    );
  },
  1: () => {
    const f = (x: 1) => x;
    eq(dethunk(f), f);
  },
}));

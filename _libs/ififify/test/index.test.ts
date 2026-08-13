import { describe } from "~testing";

import { ifFunction } from "../src";

describe(ifFunction, ({ eq }) => ({
  fun: () => {
    eq(
      ifFunction(
        () => 1,
        (x) => x(),
      ),
      1,
    );
  },
  non_fun: () => {
    eq(
      ifFunction(
        1,
        () => 1,
        (x) => x + x,
      ),
      2,
    );
  },
  non_fun_id: () => {
    eq(
      ifFunction(1, () => 1),
      1,
    );
  },
}));

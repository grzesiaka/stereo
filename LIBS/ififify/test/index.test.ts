import { describe } from "~testing";

import { ifFunction, ifKeyDefined } from "../src";
// import { __ } from "../src/-"; This breaks CI

describe(ifKeyDefined, ({ eq }) => ({
  defined: () => {
    eq(ifKeyDefined("key")({ key: "abc" } as const), "abc");
    eq(
      ifKeyDefined("key")({ key: "abc" } as const, (_, o) => o.key.length),
      3,
    );
  },
  notDefined: () => {
    eq(
      ifKeyDefined("key")(
        {} as const,
        (_, o) => o.key && 0,
        () => 1,
      ),
      1,
    );
    const x = ifKeyDefined("key")({});
    eq(x, void 0);
  },
}));

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

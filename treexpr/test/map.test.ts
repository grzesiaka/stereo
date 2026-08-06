import { describe } from "~testing";

import o from "composyo/o";

import map from "../src/map";
import { TREExprs } from "../src";

describe(map, ({ eq }) => ({
  empty: () => {
    const x = map(() => 0)([]);
    eq(x, []);

    const p = o([] as TREExprs<["abc", 1]>)(
      (x) => x,
      map((x) => x[0]),
    );
  },
}));

import { describe } from "~testing";

import { hierarchy } from "../src/hierarchy";

describe(hierarchy, ({ eq }) => ({
  empty: () => {
    const h = hierarchy()(() => ["⨁", "[]", []]);
    eq(h)(["⨁", "[]", []]);
  },
  single: () => {
    const h = hierarchy<{ op_1: (x: 1) => 1; op_12: (x: 12) => 12 }>()(($) => [
      "⨂",
      "root",
      [$.op_1(1), $.op_12(12), ["⨁", "OR", [$.op_1(1)] as any as [["op_1", ["222"]]]]],
    ]);
    eq(h)([
      "⨂",
      "root",
      [
        ["op_1", [1]],
        ["op_12", [12]],
        ["⨁", "OR", []],
      ],
    ]);
  },
}));

import { describe } from "~testing";

import remove from "../src/remove";

const r = remove([2, 1, 3])([2, 3, 1, 1, 4, 1]);

describe(remove, ({ eq }) => ({
  empty_empty: () => eq(remove([])([]), []),
  same: () => eq(remove([2, 1])([2, 1, 1, 1]), []),
  not_same: () => eq(remove([2, 1])([2, 3, 1, 1, 4, 1]), [3, 4]),
}));

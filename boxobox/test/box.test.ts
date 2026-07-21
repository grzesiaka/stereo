import { describe } from "~testing";
import { box } from "../src/box";

describe(box, ({ eq }) => ({
  empty: () => {
    const b = box()()("");
    eq(b.ID, "");
  },
}));

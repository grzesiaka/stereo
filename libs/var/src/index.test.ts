import { describe } from "~testing";
import X from "./index";
import { __ } from "~js";

describe(X, ({ eq, v }) => ({
  empty: () => {
    const x = X(1);
  },
}));

import { describe } from "~testing";

import { I } from "../src/index";

describe(I, ({ eq }) => ({
  0: () => eq(I, "i"),
}));

// @vitest-environment jsdom

import { describe } from "~testing";
import * as I from "./../src/index";

describe("", ({ eq }) => ({
  empty: () => eq(I, I),
}));

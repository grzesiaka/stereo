import { describe } from "~testing";
import { run, event } from "../src";

describe(run, () => ({
  simple: () => {
    const y = event<number>()();
  },
}));

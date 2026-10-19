import { describe } from "~testing";
import { run, event, map } from "../src";

describe(run, () => ({
  simple: () => {
    const y = event<number>()(run(($) => $(map((x) => x * x))));
  },
}));

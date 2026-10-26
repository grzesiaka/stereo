import { $describe, setupFakeTimers, describe } from "~testing";
import { $IO } from "../src";

describe("sync", ({ eq, res }) => ({
  id: () => {
    const io = $IO(() => 0)<number[], number>(() => {});
  },
}));

import { describe } from "~testing";
import { ERR } from "../src";

describe("", ({ eq }) => ({
  ERR: () => {
    eq(ERR.abort() instanceof Error, true);
    const e = new ERR.abort.$("ctx");
    eq(e instanceof Error, true);
    eq(e.name, "taskyo.err.abort");
    eq(e.ctx, ["ctx"]);
  },
}));

import { describe } from "~testing";
import byId from "../out/indexify.mjs";

const objs = [{ id: "A", name: "00" }, { value: "?" }, { id: "B", name: "11" }] as const;

describe(byId, ({ eq }) => ({
  empty: () => eq(byId()([]), {}),
  default: () => eq(byId()(objs), { A: objs[0], B: objs[2] }),
}));

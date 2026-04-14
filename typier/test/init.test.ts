import { describe } from "~testing";
import { fromTree, S } from "../src/index";

describe(fromTree, ({ eq }) => ({
  empty: () => {
    eq(fromTree({}), {});
  },
  flat: () => {
    const s = S({ minLength: 2 });
    const t = fromTree({ type_key: s });
    eq(t.type_key.$TYP, "type_key");
    eq(t.type_key.$KEY, "type_key");
    eq(t.type_key.minLength, 2);
  },
  nested: () => {
    const s = S({ minLength: 2 });
    const t = fromTree({ "0": { type: { key: s } } });
    eq(t["0"].type.key.$TYP, "0.type.key");
    eq(t["0"].type.key.$KEY, "key");
    eq(t["0"].type.key.minLength, 2);
  },
}));

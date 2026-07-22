import { describe } from "~testing";
import { fromTree, S, N, B } from "typier";

import { box } from "../src/box";
import { wire } from "../src/wire";

const T = fromTree({
  first_name: S(),
  last_name: S(),
  full_name: S(),
  age: N(),
  active: B(),
  random: B(),
});

describe(box, ({ eq }) => ({
  empty: () => {
    const b = box()()("");
    eq(b.ID, "");
  },
  simple: () => {
    const b = box(T.first_name, T.last_name)(T.full_name)(T.full_name.$KEY);
    eq(b.ID, "full_name");
    eq(b.IN, [T.first_name, T.last_name]);
    eq(b.OUT, [T.full_name]);
  },
}));

describe(wire, ({ eq }) => ({
  simple: () => {
    const f = box()(T.age, T.active)("from");
    const t = box(T.age, T.active, T.random, T.active.$("active_2"))()("to");
    const w1 = wire([f, t])("from->active")("to<-active");
    eq(w1, ["from->active", ["to<-active"]]);
    const w2 = wire([f, t])("from->active")("to<-active", "to<-active_2");
    eq(w2, ["from->active", ["to<-active", "to<-active_2"]]);
  },
}));

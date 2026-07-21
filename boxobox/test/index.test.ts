import { describe } from "~testing";
import { fromTree, S, N, B } from "typier";

import { box, DerefPortId, OutputId, OutputId$Type, Port$Type, PortRef } from "../src/box";
import { wire } from "../src/nest";

const T = fromTree({
  first_name: S(),
  last_name: S(),
  full_name: S(),
  age: N(),
  active: B(),
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
    const t = box(T.age, T.active)()("to");

    type Bs = (typeof f | typeof t)[];

    type fRef = PortRef<(typeof f | typeof t)["OUT"]>;
    type Out = OutputId<Bs[number]>;

    type Ty = OutputId$Type<Bs[number], "from->age">;
    type DeRef = DerefPortId<Bs[number]["OUT"], "age">;
    type TTT = Port$Type<DeRef>;
    const w = wire([f, t])("from->active")("to<-active");
  },
}));

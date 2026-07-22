import { describe } from "~testing";
import { fromTree, S, N, B } from "typier";

import { box } from "../src/box";
import { from, to } from "../src/wire";

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

describe("wire", ({ eq }) => {
  const b1 = box(T.first_name)(T.age, T.active, T.active.$("activer"))("b1");
  const b2 = box(T.age, T.active, T.random, T.active.$("active_2"))()("b2");
  return {
    from: () => {
      const $ = from([b1, b2]);
      const w1 = $("b1->active", "b2<-active");
      eq(w1, ["b1->active", "b2<-active"]);
      const w2 = $("b1->active", "b2<-active", "b2<-active_2");
      eq(w2, ["b1->active", ["b2<-active", "b2<-active_2"]]);

      const empty = $("b1->age");
      // no runtime check so just empty array present
      eq(empty, ["b1->age", [] as any]);
    },

    to: () => {
      const $ = to([b1, b2]);
      const w1 = $("b2<-active", "b1->active");
      eq(w1, ["b2<-active", "b1->active"]);
      const w2 = $("b2<-active", "b1->active", "b1->activer");
      eq(w2, ["b2<-active", ["b1->active", "b1->activer"]]);

      // @ts-expect-error no runtime check
      const err = $("b2<-age", "non-port-id");
      //  @ts-expect-error
      eq(err, ["b2<-age", "non-port-id"]);
    },
  };
});

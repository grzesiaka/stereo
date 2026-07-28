import { describe } from "~testing";
import { fromTree, S, N, B } from "typier";

import { box, __, autoWire, from, to, flatWires, portsByKey, freePorts } from "../src";

const T = fromTree({
  first_name: S(),
  last_name: S(),
  full_name: S(),
  age: N(),
  active: B(),
  random: B(),
});

const active_2 = T.active.$("active_2");
const activer = T.active.$("activer");

const b1 = box(T.first_name, __ as __<string>)(T.age, T.active, activer)("b1");
const b2 = box(T.age, T.active, T.random, active_2)(__ as __<"abc">, T.first_name)("b2");

describe(box, ({ eq }) => ({
  empty: () => {
    const b = box()()("");
    eq(b.ID, "");
  },
  with_context: () => {
    const b = box(T.first_name, T.last_name)(T.full_name)({ ID: T.full_name.$KEY, ctx: true });
    eq(b.ID, "full_name");
    eq(b.ctx, true);
    eq(b.IN, [T.first_name, T.last_name]);
    eq(b.OUT, [T.full_name]);
  },
  ports: () => {
    const ps = portsByKey([b1, b2]);
    eq(ps.IN, {
      "b1<-1": __,
      "b1<-first_name": T.first_name,
      "b2<-active": T.active,
      "b2<-active_2": active_2,
      "b2<-age": T.age,
      "b2<-random": T.random,
    });
    eq(ps.OUT, {
      "b1->active": T.active,
      "b1->activer": activer,
      "b1->age": T.age,
      "b2->0": __,
      "b2->first_name": T.first_name,
    });
  },
}));

describe("wire", ({ eq }) => {
  return {
    from: () => {
      const $ = from([b1, b2], [["b2->first_name", "b1<-first_name"]]);
      const w1 = $("b1->active")("b2<-active");
      eq(w1, ["b1->active", "b2<-active"]);
      const w2 = $("b1->active")(["b2<-active", "b2<-active_2"]);
      eq(w2, ["b1->active", ["b2<-active", "b2<-active_2"]]);
      const w3 = $("b2->0")("b1<-1");
      eq(w3, ["b2->0", "b1<-1"]);

      const empty = $("b1->age")([]);
      // no runtime check so just empty array present
      eq(empty, ["b1->age", [] as any]);

      // @ts-expect-error b2->first_name was excluded
      $("b2->first_name");
    },

    to: () => {
      const $ = to([b1, b2], [["b2->first_name", "b1<-first_name"]]);
      const w1 = $("b2<-active")("b1->active");
      eq(w1, ["b1->active", "b2<-active"]);
      const w2 = $("b2<-active")(["b1->active", "b1->activer"]);
      eq(w2, [["b1->active", "b1->activer"], "b2<-active"]);
      const w3 = $("b1<-1")("b2->0");
      eq(w3, ["b2->0", "b1<-1"]);

      // @ts-expect-error no runtime check
      const err = $("b2<-age")("non-port-id");
      //  @ts-expect-error
      eq(err, ["non-port-id", "b2<-age"]);

      // @ts-expect-error excluded
      $("b1<-first_name");
    },

    auto: () => {
      const p = autoWire([b1, b2]);

      eq(p, [
        ["b1->age", "b2<-age"],
        [
          ["b1->active", "b1->activer"],
          ["b2<-active", "b2<-active_2"],
        ],
        ["b2->first_name", "b1<-first_name"],
      ]);

      const flat = [
        ["b1->age", "b2<-age"],
        ["b1->active", "b2<-active"],
        ["b1->active", "b2<-active_2"],
        ["b1->activer", "b2<-active"],
        ["b1->activer", "b2<-active_2"],
        ["b2->first_name", "b1<-first_name"],
      ] as const;

      eq(flat, flatWires(p));
      eq(flatWires(p), flatWires(flatWires(p)));

      const free = freePorts([b1, b2], p);
      const { IN, OUT, byKey } = free;
      console.log(free);
    },
  };
});

// describe(xBox, ({ eq }) => ({
//   empty: () => {},
// }));

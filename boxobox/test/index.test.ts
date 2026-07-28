import { describe } from "~testing";
import { fromTree, S, N, B } from "typier";

import { box, __, autoWire, from, to, flatWires, portsByKey, freePortsKV, x } from "../src";

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

describe("wire", ({ eq }) => ({
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

  auto_flat_free: () => {
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

    const free = freePortsKV([b1, b2], p);
    const free_flat = freePortsKV([b1, b2], flat);
    const { IN, OUT, byKey } = free;
    eq(free, free_flat);
    eq(IN, [
      ["b1<-1", __],
      ["b2<-random", T.random],
    ]);
    eq(OUT, [["b2->0", __]]);

    eq(byKey, {
      IN: {
        "b1<-1": __,
        "b2<-random": T.random,
      },
      OUT: {
        "b2->0": __,
      },
    });
  },
}));

describe(x, ({ eq }) => ({
  empty: () => {
    eq(x([], () => [])(""), {
      ID: "",
      IN: [],
      OUT: [],
      "><": [],
      "][": [],
    });
  },
  simple: () => {
    const xed = x([b1, b2], (f, t) => {
      return [
        f("b1->active")(["b2<-active", "b2<-active_2"]),
        ["b1->activer", ["b2<-active", "b2<-active_2"]],
        t("b1<-first_name")("b2->first_name"),
      ];
    })("? ? ?");
    const w = xed["><"];
    const { IN, OUT } = xed;
    // console.log(OUT);
  },
}));

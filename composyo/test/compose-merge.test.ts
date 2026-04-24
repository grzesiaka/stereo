import { describe } from "~testing";
import m from "../src/compose-merge";
import { __ } from "jsyoyo";

const L = {
  _1: { 1: 1 },
  _2: { 2: 2 },
  _3: { 3: 3 },
  _4: { 4: 4 },
  _5: () => "_5",
  _6: () => null,
  _7: { 7: 7 },
} as const;

describe(m, ({ eq }) => ({
  empty: () => eq({}, m({})()),
  empty_L: () => {
    eq(m.$({ L: "L" })()(), {});
  },
  // @ts-expect-error from some reason such construct does not work seems like typescript quirk as above in {} works fine
  empty_L_why_broken: () => eq(m.$({ L: "L" })()(), {}),
  _1: () => {
    const f = m({ 0: 0 }, L)((_, L) => L._1)();
    eq(f, { 0: 0, 1: 1 });
  },
  _2: () => {
    const f = m.$(L)<{ 0: 0 }>()(
      (_, L) => L._1,
      (_, L) => L._2,
    );
    eq(f({ 0: 0 }), { 0: 0, 1: 1, 2: 2 });
  },
  _3: () => {
    const f = m({ 0: 0 }, L)(
      (_, L) => L._1,
      (_, L) => L._2,
      () => L._3,
    )();
    eq(f, { 0: 0, 1: 1, 2: 2, 3: 3 });
  },
  _4: () => {
    const f = m.$(L)<{ 0: 0 }>()(
      (_, L) => L._1,
      (_, L) => L._2,
      () => L._3,
      () => L._4,
    );
    eq(f({ 0: 0 }), { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 });
  },
  _5: () => {
    const f = m({ 0: 0 }, L)(
      (_, L) => L._1,
      (_, L) => L._2,
      () => L._3,
      () => "LABEL",
      (_, _L, R) => ({ R }),
    )();
    const R = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, "LABEL"] as any;
    R.push({ R });
    eq(f, { 0: 0, 1: 1, 2: 2, 3: 3, R });
  },
  _6: () => {
    const f = m.$(L)<{ 0: 0 }>()(
      (_, L) => L._1,
      (_, L) => L._2,
      () => L._3,
      () => L._4,
      L._5,
      (_, _L, R) => ({ R }),
    );
    const R = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, { 4: 4 }, "_5"] as any;
    R.push({ R });
    eq(f({ 0: 0 }), { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, R });
  },

  _7: () => {
    const f = m({ 0: 0 }, L)(
      (_, L) => L._1,
      (_, L) => L._2,
      () => L._3,
      () => "LABEL",
      (_, _L, R) => ({ R }),
      (x) => ({ 6: `${x[2]} x ${x[3]}` }),
      () => null,
    )();
    const R = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, "LABEL"] as any;
    R.push({ R });
    R.push({ 6: `2 x 3` }, null); // [!] R is modified by next steps
    eq(f, { 0: 0, 1: 1, 2: 2, 3: 3, R, 6: `2 x 3` });
  },
  _8: () => {
    const f = m.$(L)<{ 0: 0 }>()(
      (_, L) => L._1,
      (_, L) => L._2,
      () => L._3,
      () => L._4,
      L._5,
      (x) => ({ 6: `${x[2]} x ${x[3]}` }),
      (_, _L, R) => ({ R }),
      () => null,
    );
    const R = [{ 1: 1 }, { 2: 2 }, { 3: 3 }, { 4: 4 }, "_5", { 6: `2 x 3` }] as any;
    R.push({ R });
    R.push(null); // [!] R is modified by next steps
    eq(f({ 0: 0 }), { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, R, 6: `2 x 3` });
  },
}));

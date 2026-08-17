import { describe } from "~testing";
import { $rect, rect, inset, outset, center } from "../src/base";
import { $col, $row } from "../src/grouping";

const r0 = rect(0, 0, 0, 0);
const r1 = rect(1, 1, 1, 1);
const r42 = rect(2, 2, 4, 2);

const randInt = (max: number, min = 0) => (min + Math.random() * (max - min)) | 0;

describe(rect, ({ eq }) => ({
  0: () => {
    eq(r0, { x: 0, y: 0, w: 0, h: 0 });
    eq($rect({ 0: 1 })(0, 0, 0, 0), { "0": 1, x: 0, y: 0, w: 0, h: 0 });
  },
  center: () => {
    eq(center(r0), { x: 0, y: 0 });
    eq(center(r1), { x: 1.5, y: 1.5 });
  },

  inset: () => {
    eq(inset(r0)(0), r0);
    eq(inset(r1)(1), { x: 2, y: 2, w: -1, h: -1 });
  },
  outset: () => {
    eq(outset(r0)(0), r0);
    eq(outset(r1)(1), { x: 0, y: 0, w: 3, h: 3 });
  },
  inset_outset_are_reverses: () => {
    const d = randInt(49);
    const r = rect(randInt(49), randInt(49), randInt(49), randInt(49));
    eq(outset(inset(r)(d))(d), r);
    eq(inset(outset(r)(d))(d), r);
  },
}));

describe("grouping", ({ eq }) => ({
  empty: () => {
    const r = $row()([]);
    eq(r)({ "[]": [], gap: 0, ...r0 });

    const c = $col()([]);
    eq(c)({ "[]": [], gap: 0, ...r0 });
  },
  single: () => {
    const r = $row({ gap: 4, y: 2 })([r1]);
    eq(r)({ "[]": [r1], gap: 4, ...r1, y: 2 });

    const c = $col({ gap: 4, y: 2 })([r42]);
    eq(c)({ "[]": [r42], gap: 4, ...r42, y: 2 });
  },

  more: () => {
    const r = $row({ gap: 4, y: 2 })([r1, r42]);
    eq(r)({ "[]": [r1, r42], gap: 4, x: 1, y: 2, w: 9, h: 2 });

    const c = $col({ gap: 3, y: 2 })([r42, r1]);
    eq(c)({ "[]": [r42, r1], gap: 3, x: 2, y: 2, w: 4, h: 6 });
  },
}));

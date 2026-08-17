import { describe } from "~testing";
import { $rect, rect, inset, outset, center } from "../src/base";
import { $row } from "../src/grouping";

const r0 = rect(0, 0, 0, 0);
const r1 = rect(1, 1, 1, 1);

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
    const e = $row()([]);
    eq(e)({ "[]": [], gap: 0, ...r0 });
  },
  single: () => {
    const e = $row({ gap: 4, y: 2 })([r1]);
    eq(e)({ "[]": [r1], gap: 4, ...r1, y: 2 });
  },
}));

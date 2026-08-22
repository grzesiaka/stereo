import { describe } from "~testing";
import { pipe, compose, __, GET_OP } from "composyo";
import { $asOPs, ARR } from "jsyoyo";

import { $rect, rect, inset, outset, center, resizeBy, moveTo, resizeTo, moveBy, Rect, intersect } from "../src/base";
import { $col, $row } from "../src/inout";
import { horizontal, vertical } from "../src";

const r0 = rect(0, 0, 0, 0);
const r1 = rect(1, 1, 1, 1);
const r42 = rect(2, 2, 4, 2);
const r_1024_2048 = rect(0, 0, 1024, 2048);

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
    eq(inset(0)(r0), r0);
    eq(inset(1)(r1), { x: 2, y: 2, w: -1, h: -1 });
  },
  outset: () => {
    const out0 = outset(0)(r0);
    eq(out0, r0);
    const out1 = outset(1)(r1);
    eq(out1, { x: 0, y: 0, w: 3, h: 3 });
  },
  inset_outset_are_reverses: () => {
    const d = randInt(49);
    const r = rect(randInt(49), randInt(49), randInt(49), randInt(49));
    eq(outset(d)(inset(d)(r)), r);
    eq(inset(d)(outset(d)(r)), r);
  },

  pipe: () => {
    const x0 = pipe(r1)(moveTo(46, 46), resizeTo(35, 35));
    eq(x0)({ x: 46, y: 46, w: 35, h: 35 });

    const x1 = pipe(x0)(moveBy(2, 2), resizeBy(3, 3), inset(3), outset(2));
    eq(x1)({ x: 49, y: 49, w: 36, h: 36 });
  },

  compose: () => {
    const c0 = compose(__ as __<Rect>)(moveTo(46, 46), resizeTo(35, 35));
    const x0 = c0(r0);
    eq(x0)({ x: 46, y: 46, w: 35, h: 35 });

    const c1 = compose(x0)(moveBy(2, 2), resizeBy(3, 3), inset(3), outset(2));
    const x1 = c1(x0);
    eq(x1)({ x: 49, y: 49, w: 36, h: 36 });
  },
}));

describe("inout", ({ eq }) => ({
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

  2: () => {
    const r = $row({ gap: 4, y: 2 })([r1, r42]);
    eq(r)({ "[]": [r1, r42], gap: 4, x: 1, y: 2, w: 9, h: 2 });

    const c = $col({ gap: 3, y: 2 })([r42, r1]);
    eq(c)({ "[]": [r42, r1], gap: 3, x: 2, y: 2, w: 4, h: 6 });
  },

  5: () => {
    const xs = [r1, r42, r1, r42, r1] as const;
    const r = $row({ gap: 1, y: 2 })(xs);
    eq(r)({ "[]": xs, gap: 1, x: 1, y: 2, w: 15, h: 2 });

    const c = $col({ gap: 3, y: 2 })(xs);
    eq(c)({ "[]": xs, gap: 3, x: 1, y: 2, w: 4, h: 19 });
  },

  array: () => {
    const xs = [r1, r42, r1, r42, r1];
    const r = $row({ gap: 1, y: 2 })(xs);
    eq(r)({ "[]": xs, gap: 1, x: 1, y: 2, w: 15, h: 2 });

    const c = $col({ gap: 3, y: 2 })(xs);
    eq(c)({ "[]": xs, gap: 3, x: 1, y: 2, w: 4, h: 19 });
  },
}));

describe("outin", ({ eq }) => ({
  vertical: () => {
    let rs = vertical([1, "A"], 1, [2, { "?": "!" }])(r42);

    eq(rs)([
      { Id: "A", x: 2, y: 2, w: 1, h: 2 },
      { x: 3, y: 2, w: 1, h: 2 },
      { x: 4, y: 2, w: 2, h: 2, "?": "!" },
    ]);

    rs = vertical([1, "A"], 1, [-1, { "?": "!" }])(r42);
    eq(rs)([
      { Id: "A", x: 2, y: 2, w: 1, h: 2 },
      { x: 3, y: 2, w: 1, h: 2 },
      { x: 4, y: 2, w: 2, h: 2, "?": "!" },
    ]);
  },

  horizontal: () => {
    let rs = horizontal([100, "header"], [1548, "main"], [400, "footer"])(r_1024_2048);
    eq(rs)([
      { Id: "header", x: 0, y: 0, w: 1024, h: 100 },
      { Id: "main", x: 0, y: 100, w: 1024, h: 1548 },
      { Id: "footer", x: 0, y: 1648, w: 1024, h: 400 },
    ]);

    rs = horizontal([100, "header"], [1548, "main"], [-1, "footer"])(r_1024_2048);
    eq(rs)([
      { Id: "header", x: 0, y: 0, w: 1024, h: 100 },
      { Id: "main", x: 0, y: 100, w: 1024, h: 1548 },
      { Id: "footer", x: 0, y: 1648, w: 1024, h: 400 },
    ]);
  },
}));

describe(intersect, ({ eq }) => ({
  zero: () => {
    const x0 = intersect(r0)(r0);
    eq(x0, r0);
    const x_01 = intersect(r0)(r1);
    const x_10 = intersect(r1)(r0);
    eq(x_01, rect(1, 1, 0, 0));
    eq(x_10, rect(1, 1, 0, 0));
  },

  small: () => {
    eq(intersect(rect(2, 2, 3, 3))(rect(2, 4, 2, 2)), rect(2, 4, 2, 1));
    eq(intersect(rect(2, 2, 3, 3))(rect(3, 4, 2, 2)), rect(3, 4, 2, 1));
    eq(intersect(rect(2, 2, 3, 3))(rect(5, 5, 2, 2)), rect(5, 5, 0, 0));
    eq(intersect(rect(2, 2, 3, 3))(rect(7, 6, 2, 2)), rect(7, 6, 0, 0));
  },
}));

const $ = $asOPs<true>()({ moveBy, resizeBy });
describe("ops", ({ eq }) => ({
  ops: () => {
    const { moveBy, resizeBy } = $;
    const o = compose(r0)(moveBy(1, 1), resizeBy(2, 2));
    const fns = GET_OP(o)?.[1][2].map((f) => (f as any).__ as [string, ARR]);
    eq(fns, [
      ["moveBy", [1, 1]],
      ["resizeBy", [2, 2]],
    ]);
    eq(o(), { x: 1, y: 1, w: 2, h: 2 });
  },
}));

describe("long", ({ eq }) => ({
  long: () => {
    const c = compose(r0)(
      resizeBy(2, 2),
      eq(rect(0, 0, 2, 2)),
      intersect(rect(1, 1, 2, 2)),
      eq(rect(1, 1, 1, 1)),
      moveBy(2, 2),
      eq(rect(3, 3, 1, 1)),
      resizeBy(3, 3),
      compose(__ as __<Rect<3, 3, 4, 4>>)(
        eq(rect(3, 3, 4, 4)),
        outset(1),
        eq(rect(2, 2, 6, 6)),
        moveBy(1, 2),
        eq(rect(3, 4, 6, 6)),
        center,
      ),
    );
    eq(c())({ x: 6, y: 7 });
  },
}));

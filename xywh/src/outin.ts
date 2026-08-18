import { ARR } from "~types";
import { rect, Rect } from "./base";
import cId, { type CtxIdConstraint, CtxId } from "jsyoyo/ctxid";
import { Subtract, Sum } from "numyo";

type Split<V extends number = number, Ctx extends CtxIdConstraint = CtxIdConstraint> = V | [V, Ctx];
type Splits = ARR<Split>;

export type SplitVertical<
  P extends Rect,
  S,
  X extends number = P["x"],
  H extends number = P["h"],
> = S extends readonly [Split<infer W, infer Ctx>, ...infer R]
  ? [
      CtxId<
        CtxIdConstraint extends Ctx ? {} : Ctx,
        Rect<X, P["y"], -1 extends W ? Subtract<Sum<[P["w"], P["x"]]>, X> & number : W, H>
      >,
      ...SplitVertical<P, R, -1 extends W ? Subtract<Sum<[P["w"], P["x"]]>, X> & number : Sum<[X, W]>, H>,
    ]
  : [];

export const vertical =
  <const cR extends Rect, const S extends Splits>(...ss: S) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) => {
    let x = r.x;
    let rs = [] as Rect[];
    for (const s of ss) {
      const ctx = (s as any)[1];
      let w = typeof s === "number" ? s : s[0];
      if (w === -1) {
        w = r.x + r.w - x;
      }
      rs.push(cId(rect(x, r.y, w, r.h), ctx));
      x += w;
    }
    return rs as SplitVertical<R, S>;
  };

export type SplitHorizontal<
  P extends Rect,
  S,
  Y extends number = P["y"],
  W extends number = P["w"],
> = S extends readonly [Split<infer H, infer Ctx>, ...infer R]
  ? [
      CtxId<
        CtxIdConstraint extends Ctx ? {} : Ctx,
        Rect<P["x"], Y, W, -1 extends H ? Subtract<Sum<[P["h"], P["y"]]>, Y> & number : H>
      >,
      ...SplitHorizontal<P, R, -1 extends H ? Subtract<Sum<[P["h"], P["y"]]>, Y> & number : Sum<[Y, H]>, W>,
    ]
  : [];

export const horizontal =
  <const cR extends Rect, const S extends Splits>(...ss: S) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) => {
    let y = r.y;
    let rs = [] as Rect[];
    for (const s of ss) {
      const ctx = (s as any)[1];
      let h = typeof s === "number" ? s : s[0];
      if (h === -1) {
        h = r.y + r.h - y;
      }
      rs.push(cId(rect(r.x, y, r.w, h), ctx));
      y += h;
    }
    return rs as SplitHorizontal<R, S>;
  };

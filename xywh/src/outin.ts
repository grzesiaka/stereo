import { ARR } from "~types";
import { rect, Rect } from "./base";
import cId, { type CtxIdConstraint, CtxId } from "jsyoyo/ctxid";
import { Sum } from "numyo";

type Split<V extends number = number, Ctx extends CtxIdConstraint = CtxIdConstraint> = V | [V, Ctx];
type Splits = ARR<Split>;

export type SplitVertical<
  P extends Rect,
  S,
  X extends number = P["x"],
  H extends number = P["h"],
> = S extends readonly [Split<infer W, infer Ctx>, ...infer R]
  ? [CtxId<CtxIdConstraint extends Ctx ? {} : Ctx, Rect<X, P["y"], W, H>>, ...SplitVertical<P, R, Sum<[X, W]>, H>]
  : [];

export const vertical =
  <const cR extends Rect, const S extends Splits>(...ss: S) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) => {
    let x = r.x;
    let rs = [] as Rect[];
    for (const s of ss) {
      const ctx = (s as any)[1];
      const w = typeof s === "number" ? s : s[0];
      rs.push(cId(rect(x, r.y, w, r.h), ctx));
      x += w;
    }
    return rs as SplitVertical<R, S>;
  };

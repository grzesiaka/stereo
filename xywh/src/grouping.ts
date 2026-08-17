import { Max, Product, Sum, sum } from "numyo";
import { ij_Project } from "proyij";
import { $rect, Rect } from "./base";
import { ARR } from "~types";

export type Rects = ARR<Rect>;

export type GroupedRect<
  E extends object,
  Rs extends Rects = Rects,
  X extends number = number,
  Y extends number = number,
  W extends number = number,
  H extends number = number,
> = Rect<X, Y, W, H> & {
  "[]": Rs;
} & E;

export interface StackParams extends Partial<Rect> {
  gap: number;
}

type ResolveX<SP extends StackParams, Rs extends Rects> = SP["x"] extends number
  ? SP["x"]
  : Rs[0]["x"] extends number
    ? Rs[0]["x"]
    : 0;

type ResolveY<SP extends StackParams, Rs extends Rects> = SP["y"] extends number
  ? SP["y"]
  : Rs[0]["y"] extends number
    ? Rs[0]["y"]
    : 0;

export type Row<
  Params extends StackParams = StackParams,
  Rs extends Rects = Rects,
  X extends number = number,
  Y extends number = number,
  W extends number = number,
  H extends number = number,
> = GroupedRect<Params, Rs, X, Y, W, H>;

export const $row =
  <const P extends StackParams = { gap: 0 }>(p = { gap: 0 } as P) =>
  <const Rs extends Rects>(
    rs: Rs,
  ): Row<
    P,
    Rs,
    ResolveX<P, Rs>,
    ResolveY<P, Rs>,
    Sum<[Sum<ij_Project<["w"], Rs>>, Product<[Sum<[Rs["length"], -1]>, P["gap"]]>]>,
    Max<ij_Project<["h"], Rs>, 0>
  > =>
    $rect({
      "[]": rs,
      ...p,
    })(
      ("x" in p ? p["x"] : rs[0]?.x) || 0,
      ("y" in p ? p["y"] : rs[0]?.y) || 0,
      sum(rs.map((r) => r.w)) + p.gap * (rs.length - 1),
      rs.length ? Math.max(...rs.map((r) => r.h)) : 0,
    ) as never;

export type Col<
  Params extends StackParams = StackParams,
  Rs extends Rects = Rects,
  X extends number = number,
  Y extends number = number,
  W extends number = number,
  H extends number = number,
> = GroupedRect<Params, Rs, X, Y, W, H>;

export const $col =
  <const P extends StackParams = { gap: 0 }>(p = { gap: 0 } as P) =>
  <const Rs extends Rects>(
    rs: Rs,
  ): Col<
    P,
    Rs,
    ResolveX<P, Rs>,
    ResolveY<P, Rs>,
    Max<ij_Project<["w"], Rs>, 0>,
    Sum<[Sum<ij_Project<["h"], Rs>>, Product<[Sum<[Rs["length"], -1]>, P["gap"]]>]>
  > =>
    $rect({
      "[]": rs,
      ...p,
    })(
      ("x" in p ? p["x"] : rs[0]?.x) || 0,
      ("y" in p ? p["y"] : rs[0]?.y) || 0,
      rs.length ? Math.max(...rs.map((r) => r.w)) : 0,
      sum(rs.map((r) => r.h)) + p.gap * (rs.length - 1),
    ) as never;

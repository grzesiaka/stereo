import { Fn, id } from "jsyoyo";
import { Yo, oYo, oYo$X } from "../base/yo";

export type Filter<Prev extends oYo> = oYo<oYo$X<Prev>, Prev>;

export type FilterOp = <Prev extends oYo>(
  f: Fn<[oYo$X<Prev>], boolean | 0 | 1 | undefined>,
) => (P: Prev) => Filter<Prev>;

export const filter = Yo<"filter", [Fn], Fn>(
  "filter",
  id,
)(($, P) => ($.Y = P((x) => $.__[1]!(x) && $.o(x)))) as never as FilterOp;

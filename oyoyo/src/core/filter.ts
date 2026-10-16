import { Fn, id } from "jsyoyo";
import { OPED, OP, Yo, oYo, oYo$X } from "../base/yo";

type FilterFn<Prev> = Fn<[oYo$X<Prev>], boolean | 0 | 1 | undefined>;
export type Filter<Prev extends oYo> = OPED<oYo$X<Prev>, Prev, {}, "filter", FilterFn<Prev>>;

export type FilterOp = <Prev extends oYo>(f: FilterFn<Prev>) => OP<Filter<Prev>>;

export const filter = Yo<"filter", [Fn], Fn>(
  "filter",
  id,
)(($, P) => ($.Y = P((x) => $.__[1]!(x) && $.o(x)))) as never as FilterOp;

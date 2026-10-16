import { Fn, Fn$O, id } from "jsyoyo";
import { OP, $OP, Yo, oYo, Yo$X, oYo$X } from "../base/yo";

type FilterFn<Prev> = Fn<[oYo$X<Prev>], boolean | 0 | 1 | undefined>;
export type Filter<Prev extends Yo> = OP<Yo$X<Prev>, Prev, {}, "filter", FilterFn<Prev>>;
export type Filter$<Prev extends oYo> = $OP<Filter<Fn$O<Prev>>>;
export type FilterOp = <Prev extends oYo>(f: FilterFn<Prev>) => (Y: Prev) => Filter$<Prev>;

export const filter = Yo<"filter", [Fn], Fn>(
  "filter",
  id,
)(($, P) => ($.Y = P((x) => $.__[1]!(x) && $.o(x)))) as never as FilterOp;

import { Fn, id } from "jsyoyo";
import { $yo, yo, yo$X } from "./yo";

export type Filter<Prev extends yo> = yo<yo$X<Prev>, Prev>;

export type FilterOp = <Prev extends yo>(f: Fn<[yo$X<Prev>], boolean | 0 | 1 | undefined>) => (P: Prev) => Filter<Prev>;

export const filter = $yo<"filter", [Fn], Fn>(
  "filter",
  id,
)(($, P) => ($.P = P((x) => $.__[1]!(x) && $.I(x)))) as never as FilterOp;

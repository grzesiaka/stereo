import { Fn, Fn$O, id } from "jsyoyo";
import { OP, $OP, Yo, oYo, oYo$X, Yo$X } from "../base/yo";

export type Map<X, Prev extends Yo> = OP<X, Prev, {}, "map", Fn<[Yo$X<Prev>], X>>;
export type Map$<X, Prev extends oYo> = $OP<Map<X, Fn$O<Prev>>>;
export type MapOp = <X, Prev extends oYo>(f: Fn<[oYo$X<Prev>], X>) => (Y: Prev) => Map$<X, Prev>;

export const map = Yo<"map", [Fn], Fn>("map", id)(($, P) => ($.Y = P((x) => $.o($.__[1](x))))) as never as MapOp;

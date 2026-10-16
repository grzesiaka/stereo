import { Fn, id } from "jsyoyo";
import { OP, $OP, $$OP, Yo, oYo, oYo$X } from "../base/yo";

export type Map<X, Prev extends oYo> = OP<X, Prev, {}, "map", Fn<[oYo$X<Prev>], X>>;
export type $Map<X, Prev extends oYo> = $OP<Map<X, Prev>>;
export type MapOp = <X, Prev extends oYo>(f: Fn<[oYo$X<Prev>], X>) => $$OP<$Map<X, Prev>>;

export const map = Yo<"map", [Fn], Fn>("map", id)(($, P) => ($.Y = P((x) => $.o($.__[1](x))))) as never as MapOp;

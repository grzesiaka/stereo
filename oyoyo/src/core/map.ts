import { Fn, id } from "jsyoyo";
import { OPED, OP, Yo, oYo, oYo$X } from "../base/yo";

export type Map<X, Prev extends oYo> = OPED<X, Prev, {}, "map", Fn<[oYo$X<Prev>], X>>;

export type MapOp = <X, Prev extends oYo>(f: Fn<[oYo$X<Prev>], X>) => OP<Map<X, Prev>>;

export const map = Yo<"map", [Fn], Fn>("map", id)(($, P) => ($.Y = P((x) => $.o($.__[1](x))))) as never as MapOp;

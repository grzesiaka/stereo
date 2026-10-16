import { Fn, id } from "jsyoyo";
import { Yo, oYo, oYo$X } from "../base/yo";

export type Map<X, Prev extends oYo> = oYo<X, Prev>;

export type MapOp = <X, Prev extends oYo>(f: Fn<[oYo$X<Prev>], X>) => (P: Prev) => Map<X, Prev>;

export const map = Yo<"map", [Fn], Fn>("map", id)(($, P) => ($.Y = P((x) => $.o($.__[1](x))))) as never as MapOp;

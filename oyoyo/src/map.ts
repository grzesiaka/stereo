import { Fn, id } from "jsyoyo";
import { $yo, yo, yo$X } from "./yo";

export type Map<X, Prev extends yo> = yo<X, Prev>;

export type MapOp = <X, Prev extends yo>(f: Fn<[yo$X<Prev>], X>) => (P: Prev) => Map<X, Prev>;

export const map = $yo<"map", [Fn], Fn>("map", id)(($, P) => ($.P = P((x) => $.I($.__[1]!(x))))) as never as MapOp;

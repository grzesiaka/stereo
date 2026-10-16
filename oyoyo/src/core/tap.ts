import { Fn, Fn$O, id } from "jsyoyo";
import { OP, $OP, Yo, oYo, oYo$X, Yo$X } from "../base/yo";

export type Tap<Prev extends Yo> = OP<Yo$X<Prev>, Prev, {}, "tap", Fn<[Yo$X<Prev>]>>;
export type Tap$<Prev extends oYo> = $OP<Tap<Fn$O<Prev>>>;
export type TapOp = <X, Prev extends oYo>(f: Fn<[oYo$X<Prev>], X>) => (Y: Prev) => Tap$<Prev>;

export const tap = Yo<"tap", [Fn], Fn>("tap", id)(($, P) => ($.Y = P((x) => ($.__[1](x), $.o(x))))) as never as TapOp;

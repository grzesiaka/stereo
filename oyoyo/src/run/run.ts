import { Fn, Fn$O, id } from "jsyoyo";
import { OP, $OP, Yo, oYo, oYo$X, Yo$X } from "../base/yo";
import { Flatten } from "../base";
import { OnceEvent, OnceEvent$ } from "../core";

type ForceInitialOnce<X, Y extends oYo> = Flatten<Fn$O<Y>>[0] extends OnceEvent<X, any> ? Y : never;

type RunFn<X, Y> = Fn<[OnceEvent$<X>], Y>;

export type Run<Prev extends Yo, Y> = OP<OnceEvent<Yo$X<Prev>>, Prev, {}, "run", RunFn<Yo$X<Prev>, Y>>;
export type Run$<Prev extends oYo, Y> = $OP<Run<Fn$O<Prev>, Y>>;
export type RunOp = <Prev extends oYo, Y extends oYo>(
  f: RunFn<oYo$X<Prev>, Y>,
) => (Y: Prev) => never extends ForceInitialOnce<oYo$X<Prev>, Y> ? never : Run$<Prev, Y>;

export const run = Yo<"run", [Fn], Fn>("run", id)(($, P) => ($.Y = P((x) => $.o($.__[1](x))))) as never as RunOp;

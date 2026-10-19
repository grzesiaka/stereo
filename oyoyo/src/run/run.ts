import { Fn, Fn$O, id } from "jsyoyo";
import { OP, $OP, Yo, oYo, oYo$X, Yo$X } from "../base/yo";
import { Flatten } from "../base";
import { OnceEvent, OnceEvent$ } from "../core";

type ForceInitialOnce<X, F> = Flatten<Fn$O<Fn$O<F>>>[0] extends { I?: (x: X) => unknown } ? F : "INCORRECT_SOURCE";

type RunFn<X, Y> = Fn<[OnceEvent$<X>], Y>;

export type Run<Prev extends Yo, Y> = OP<OnceEvent<Yo$X<Prev>>, Prev, {}, "run", RunFn<Yo$X<Prev>, Y>>;
export type Run$<Prev extends oYo, Y> = $OP<Run<Fn$O<Prev>, Y>>;
export type RunOp = <Prev extends oYo, F extends (e: OnceEvent$<oYo$X<Prev>>) => oYo>(
  f: F & ForceInitialOnce<oYo$X<Prev>, F>,
) => (Y: Prev) => Run$<Prev, Fn$O<F>>;

export const run = Yo<"run", [Fn], Fn>("run", id)(($, P) => ($.Y = P((x) => $.o($.__[1](x))))) as never as RunOp;

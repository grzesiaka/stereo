import { a, DISPOSE, Fn, Fn$O, WithTag } from "jsyoyo";
import { OP, $OP, Yo, oYo, oYo$X, Yo$X } from "../base/yo";
import { dispose, Flatten } from "../base";
import { OnceEvent, OnceEvent$, val } from "../core";

type EnforceSource<X, F> = Flatten<Fn$O<Fn$O<F>>>[0] extends { I?: (x: X) => unknown }
  ? F
  : ["INCORRECT_SOURCE", { EXPECTED: { I?: (x: X) => unknown } }];
type WrapInnerFn<X = unknown, Y extends oYo = oYo> = Fn<[OnceEvent$<X>], Y>;

type Concurrency = WithTag<number, "concurrency"> | (number & {});

export interface WrapCtx {
  pending: unknown[];
  running: Yo[];
  [DISPOSE]: () => void;
}

// export type WrapOuterFn = (ctx: WrapCtx) => 1;

export type Wrap<Prev extends Yo, Y extends oYo> = OP<
  OnceEvent<Yo$X<Prev>>,
  Prev,
  WrapCtx,
  "wrap",
  [WrapInnerFn<Yo$X<Prev>, Y>, Concurrency?]
>;
export type Wrap$<Prev extends oYo, Y extends oYo> = $OP<Wrap<Fn$O<Prev>, Y>>;
export type WrapOp = <Prev extends oYo, F extends (e: OnceEvent$<oYo$X<Prev>>) => oYo>(
  f: F & EnforceSource<oYo$X<Prev>, F>,
  concurrency?: Concurrency,
) => (Y: Prev) => Wrap$<Prev, Fn$O<F>>;

export const wrap = Yo<"wrap", [WrapInnerFn, Concurrency?]>("wrap")((_, P, [fn, concurrency]) => {
  const $ = a(_, {
    pending: [] as unknown[],
    running: [] as Yo[],
    [DISPOSE]: () => {
      $.running.forEach((r) => dispose(r));
    },
  } satisfies WrapCtx);
  $.Y = P((x) => {
    const p = fn(val(x) as any)($.o);
    $.running.push(p);
  });
}) as never as WrapOp;

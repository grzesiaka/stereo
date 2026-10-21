import { __, a, DISPOSE, Fn, Fn$O, WithTag } from "jsyoyo";
import { OP, $OP, Yo, oYo, oYo$X, Yo$X, closestCompletable, makeCompletable } from "../base/yo";
import { dispose, Flatten } from "../base";
import { OnceEvent, OnceEvent$, val } from "../core";
import { ifResolved } from "ioioy";

type EnforceSource<X, F> = Flatten<Fn$O<Fn$O<F>>>[0] extends { I?: (x: X) => unknown }
  ? F
  : ["INCORRECT_SOURCE", { EXPECTED: { I?: (x: X) => unknown } }];
type WrapInnerFn<X = unknown, Y extends oYo = oYo> = Fn<[wrapped_value: OnceEvent$<X>, index: number], Y>;

type Concurrency = WithTag<number, "concurrency"> | (number & {});

export interface WrapCtx {
  idx: number;
  pending: unknown[];
  running: Yo[];
  [DISPOSE]: () => void;
}

export type Wrap<Prev extends Yo, Y extends oYo> = OP<
  OnceEvent<Yo$X<Prev>>,
  Prev,
  WrapCtx,
  "wrap",
  [WrapInnerFn<Yo$X<Prev>, Y>, Concurrency?]
>;
export type Wrap$<Prev extends oYo, Y extends oYo> = $OP<Wrap<Fn$O<Prev>, Y>>;
export type WrapOp = <Prev extends oYo, F extends WrapInnerFn<oYo$X<Prev>>>(
  f: F & EnforceSource<oYo$X<Prev>, F>,
  concurrency?: Concurrency,
) => (Y: Prev) => Wrap$<Prev, Fn$O<F>>;

export const wrap = Yo<"wrap", [WrapInnerFn, Concurrency?]>("wrap")((_, P, params) => {
  const canRun = () => $.running.length < (params[1] || Infinity);
  const run = (x: unknown) => {
    const y = params[0](val(x) as any, $.idx++)($.o);
    const z = closestCompletable(y);
    if (z) {
      ifResolved(z, nextPending, () => $.running.push(y));
    } else {
      $.running.push(y);
    }
  };

  const nextPending = () => {
    if ($.pending.length) {
      if (canRun()) {
        run($.pending.shift());
      }
    } else {
      handleComplete?.();
    }
  };

  const onNext = (x: unknown) => {
    if (canRun()) {
      run(x);
    } else {
      $.pending.push(x);
    }
  };

  const $ = a(_, {
    idx: 0,
    pending: [] as unknown[],
    running: [] as Yo[],
    [DISPOSE]: () => {
      $.running.forEach((r) => dispose(r));
    },
  } satisfies WrapCtx);

  $.Y = P((x) => $.pending.push(x)); // gymnastic around sync emissions

  let handleComplete: __<() => void>;
  const Z = closestCompletable($.Y);
  if (Z) {
    const [c] = makeCompletable($);
    handleComplete = () => {
      if (!$.running.length && Z.X !== __) {
        c($.idx);
      }
    };
  }
  $.Y.o = onNext;
  while ($.pending.length && canRun()) {
    nextPending();
  }
}) as never as WrapOp;

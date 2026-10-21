import { __, a, DISPOSE, Fn, Fn$O } from "jsyoyo";
import {
  OP,
  $OP,
  Yo,
  oYo,
  oYo$X,
  Yo$X,
  closestCompletable,
  makeCompletable,
  ClosestCompletable,
  Completable,
} from "../base/yo";
import { dispose, Flatten } from "../base";
import { OnceEvent, OnceEvent$, val } from "../core";

type EnforceSource<X, F> = Flatten<Fn$O<Fn$O<F>>>[0] extends { I?: (x: X) => unknown }
  ? F
  : ["INCORRECT_SOURCE", { EXPECTED: { I?: (x: X) => unknown } }];
type LatestInnerFn<X = unknown, Y extends oYo = oYo> = Fn<[wrapped_value: OnceEvent$<X>, index: number], Y>;

export type LatestCtx<Z> = (__ extends Z ? {} : { Z: Z }) & {
  idx: number;
  current?: Yo;
  [DISPOSE]: () => void;
};

export type Latest<Prev extends Yo, Y extends oYo> = OP<
  OnceEvent<Yo$X<Prev>>,
  Prev,
  LatestCtx<ClosestCompletable<Prev> extends __ ? __ : Completable<number>>,
  "latest",
  [LatestInnerFn<Yo$X<Prev>, Y>]
>;
export type Latest$<Prev extends oYo, Y extends oYo> = $OP<Latest<Fn$O<Prev>, Y>>;
export type LatestOp = <Prev extends oYo, F extends LatestInnerFn<oYo$X<Prev>>>(
  f: F & EnforceSource<oYo$X<Prev>, F>,
) => (Y: Prev) => Latest$<Prev, Fn$O<F>>;

export const latest = Yo<"latest", [LatestInnerFn]>("latest")((_, P, params) => {
  const run = (x: unknown) => {
    if ($.current) {
      dispose($.current);
    }
    const y = ($.current = params[0](val(x) as any, $.idx++)($.o));
    const z = closestCompletable(y);
    if (z) {
      z.Z(() => {
        $.current = __;
        handleComplete?.();
      });
    }
  };

  const $ = a(_, {
    idx: 0,
    [DISPOSE]: () => {
      $.current && dispose($.current);
    },
  } as LatestCtx<any>);

  let pending = [] as unknown[];
  $.Y = P((x) => pending.push(x)); // gymnastic around sync emissions

  let handleComplete: __<() => void>;
  const Z = closestCompletable($.Y);
  if (Z) {
    const [c] = makeCompletable($);
    handleComplete = () => {
      if (!$.current && Z.Z.X !== __) {
        c($.idx);
      }
    };
  }
  $.Y.o = run;
  while (pending.length) {
    run(pending.unshift());
  }
}) as never as LatestOp;

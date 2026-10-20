import { Pipe, pipe } from "composyo";
import { __, ARR, Cb, CtxId, CtxIdOptional, Fn$O, WithOP } from "jsyoyo";
import { Future, Subscribable } from "ioioy";
import { dispose } from "./exe";

export interface Yo<X = any, Y = any> {
  Y: Y;
  o: Cb<X>;
}
export type Yo$X<y> = y extends Yo<infer X> ? X : never;

export type oYo<X = any, Y = any, Extra = {}> = (o: Cb<X>) => Yo<X, Y extends oYo ? Fn$O<Y> : Y> & Extra;

export type oYo$X<y> = y extends oYo<infer X> ? X : never;
export type oYo$Y<y> = y extends oYo<any, infer Y> ? Y : never;

export type OP<X = any, Y = any, Extra = {}, OP_ID extends string = string, OP_PARAMS = any> = Yo<X, Y> &
  Extra & {
    __: [OP_ID, OP_PARAMS];
  };

type OP$X<O> = O extends OP<infer X> ? X : never;
export type $OP<O extends OP = OP> = (o: Cb<OP$X<O>>) => O;

export const Yo =
  <OP_ID extends string, ParamsRaw extends ARR, Params = ParamsRaw>(
    op: OP_ID,
    r = ((...x: ParamsRaw) => x) as any as (...p: ParamsRaw) => Params,
  ) =>
  <cR, cY extends __<oYo> = oYo, cX = unknown>(
    $: ($: Yo<cX> & WithOP<OP_ID, Params> & Partial<cR>, P: cY, r: ParamsRaw) => void,
  ) =>
  (...p: ParamsRaw) =>
  (P: cY) =>
  (o: Cb<cX>) => {
    const y = { o, __: [op, r(...p)] as [OP_ID, Params] } as Yo<cX, cY> & WithOP<OP_ID, Params> & Partial<cR>;
    $(y, P, p);
    return y;
  };

export type Y0<X, R extends {}, Ctx extends CtxIdOptional> = CtxId<Ctx, Yo<X, __>> & R;

export type $Y0<X, R> = Pipe<(o: Cb<X>) => R>;

export const Y0 = <X, R extends {}, Ctx extends CtxIdOptional = __>($: (o: Cb<X>) => R, ctx = __ as Ctx) =>
  pipe(ctx === __ ? $ : (o: Cb<X>) => CtxId($(o), ctx)) as never as $Y0<X, Y0<X, R, Ctx>>;

export interface Completable<Z = unknown> {
  Z: Subscribable<Z, { readonly "#": 1 }> & { X?: Z };
}

export type WithCompletable<z, Other extends {}> = Completable<z> & Other;

export const makeCompletable = <Base extends Yo, V>($: Base & Partial<Completable>, onComplete?: () => void) => {
  const io = Future.$1<V>();
  $.Z = io.O as Subscribable<V, { "#": 1 }> & { X?: V };
  const complete = (v: V) => {
    if ("X" in $.Z!) return; // may complete only once
    $.Z!.X = v;
    io.I(v);
    dispose($);
    onComplete?.();
  };
  return [complete, $] as [typeof complete, WithCompletable<V, Base>];
};

export const observeCompleted = <Y extends Yo>(Y: Y, onCompleted: () => void) => {
  let y = Y as Partial<Completable> & Yo;
  while (y) {
    if ("Z" in y) {
      !("X" in y.Z!) ? y.Z!(onCompleted) : onCompleted();
      break;
    } else {
      y = y.Y;
    }
  }
};

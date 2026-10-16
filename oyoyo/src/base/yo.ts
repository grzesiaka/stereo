import { Pipe, pipe } from "composyo";
import { __, ARR, Cb, CtxId, CtxIdOptional, DISPOSE, Fn$O, WithOP } from "jsyoyo";
import { Simplify } from "type-fest";

export interface Yo<X = any, Y = any> {
  Y: Y;
  o: Cb<X>;
}

/** Completable */

export interface YoY<X = any, Y extends YoY = Yo> extends Yo<X, Y> {}

export type oYo<X = any, Y = any, Extra = {}> = (o: Cb<X>) => Yo<X, Y extends oYo ? Fn$O<Y> : Y> & Extra;

export type oYo$X<y> = y extends oYo<infer X> ? X : never;
export type oYo$Y<y> = y extends oYo<any, infer Y> ? Y : never;

export type OPED<X = any, Y extends oYo = oYo, Extra = {}, OP_ID extends string = string, OP_PARAMS = any> = Yo<
  X,
  Fn$O<Y>
> &
  Extra & {
    __: [OP_ID, OP_PARAMS];
  };

export type OPED$X<O> = O extends OPED<infer X> ? X : never;
export type OPED$Y<O> = O extends OPED<any, infer Y> ? Y : never;
export type OP<O extends OPED> = (Y: OPED$Y<O>) => (o: Cb<OPED$X<O>>) => O;
export interface Z<Z = unknown> {
  Z: Promise<Z>;
}

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

export type Y0<X, R extends {}, Ctx extends CtxIdOptional> = Simplify<CtxId<Ctx, Yo<X, __>> & R>;

export type $Y0<X, R> = Pipe<(o: Cb<X>) => R>;

export const Y0 = <X, R extends {}, Ctx extends CtxIdOptional = __>($: (o: Cb<X>) => R, ctx = __ as Ctx) =>
  pipe(ctx === __ ? $ : (o: Cb<X>) => CtxId($(o), ctx)) as never as $Y0<X, Y0<X, R, Ctx>>;

export type Flatten<Y> = Y extends { Y: infer y } ? [...Flatten<y>, Y] : Y extends __ ? [] : [Y];
export const flatten = <Y extends YoY>(Y: Y) => {
  const r = [];
  let y = Y as Yo;
  while (y) {
    y !== __ && r.unshift(y);
    y = y.Y;
  }
  return r as Flatten<Y>;
};

export const dispose = <YY extends YoY>(YY: YY) => flatten(YY).forEach((y) => DISPOSE in y && y[DISPOSE]());

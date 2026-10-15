import { Pipe, pipe } from "composyo";
import { __, ARR, Cb, CtxId, CtxIdOptional, Fn$O, WithOP } from "jsyoyo";
import { Simplify } from "type-fest";

export interface Yo<X = any, Y = any> {
  Y: Y;
  o: Cb<X>;
}

/** Completable */
export interface Z<Z = unknown> {
  Z: Promise<Z>;
}

export interface YoY<X = any, Y extends Yo = Yo> extends Yo<X, Y> {}

export type oYo<X = any, Y = any, Extra = {}> = (o: Cb<X>) => Yo<X, Y extends oYo ? Fn$O<Y> : Y> & Extra;

export type oYo$X<y> = y extends oYo<infer X> ? X : never;
export type oYo$Y<y> = y extends oYo<any, infer Y> ? Y : never;

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

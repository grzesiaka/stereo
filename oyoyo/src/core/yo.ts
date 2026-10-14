import { __, ARR, Cb, Fn$O, WithOP } from "jsyoyo";

export interface Yo<X = any, Y = any> {
  Y: Y;
  o: Cb<X>;
}

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

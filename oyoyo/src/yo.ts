import { __, ARR, Cb, Fn$O, WithOP } from "jsyoyo";

export interface WithPrev<X = any, Prev = any> {
  I: Cb<X>;
  P: Prev;
}

export type yo<X = any, Prev = any, Extra = {}> = (
  cb: Cb<X>,
) => WithPrev<X, Prev extends yo ? Fn$O<Prev> : Prev> & Extra;

export type yo$X<y> = y extends yo<infer X> ? X : never;
export type yo$Prev<y> = y extends yo<any, infer Prev> ? Prev : never;

export const $yo =
  <OP_ID extends string, ParamsRaw extends ARR, Params = ParamsRaw>(
    o: OP_ID,
    r = ((...x: ParamsRaw) => x) as any as (...p: ParamsRaw) => Params,
  ) =>
  <cR, cPrev extends __<yo> = yo, cX = unknown>(
    $: ($: WithPrev<cX> & WithOP<OP_ID, Params> & Partial<cR>, P: cPrev, r: ParamsRaw) => void,
  ) =>
  (...p: ParamsRaw) =>
  (P: cPrev) =>
  (I: Cb<cX>) => {
    const y = { I, __: [o, r(...p)] as [OP_ID, Params] } as WithPrev<cX, cPrev> & WithOP<OP_ID, Params> & Partial<cR>;
    $(y, P, p);
    return y;
  };

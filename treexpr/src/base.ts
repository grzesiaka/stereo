import { ARR, Dict, Fn } from "~types";
import { __ } from "composyo";
export { dethunk } from "arryo";

export type TagParam<Tag = string, Param = unknown> = readonly [Tag, Param];
export type TREExpr<TPs extends TagParam = TagParam, Extra = never> =
  | Extra
  | TPs
  // TODO: investigate and if needed report as TS error `readonly [...TPs, unknown]` results in circular dependency
  //       `readonly [TPs[0], TPs[1], ARR<TREExpr<TPs>>]` is too loose on its own
  | (readonly [TPs[0], TPs[1], ARR<TREExpr<TPs, Extra>>] & readonly [...TPs, unknown]);

// export type TREExprs<TE extends TREExpr, Extra = never> = Extra | TE | ARR<TE | Extra>;
export type TREExprs<TPs extends TagParam = TagParam, Extra = never> = TREExpr<TPs, Extra> | ARR<TREExpr<TPs, Extra>>;

export type RemoveDefaultTagParam<E> = E extends TagParam ? (TagParam extends E ? never : E) : E;
export type TREExprs$TagParam<E> = E extends TREExprs<infer X> ? X : never;
export type TREExprs$TagParamStrict<E> = RemoveDefaultTagParam<TREExprs$TagParam<E>>;

export type TreeOP<
  TP extends TagParam = TagParam,
  RES = unknown,
  FromRoot extends ARR = ARR,
  Kids extends ARR = ARR,
> = Fn<[tagParam: TP, from_root: FromRoot, kids?: Kids], RES>;

export type TreeOP$Result<OP> = OP extends TreeOP<any, infer R> ? R : never;

export type TreeOPs = Dict<TreeOP>;

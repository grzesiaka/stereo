import { ARR } from "~types";
import { __ } from "composyo";
export { dethunk } from "arryo";

export type TagParam<Tag = string, Param = unknown> = readonly [Tag, Param];
export type TREExpr<TPs extends TagParam = TagParam, Extra = never> =
  | Extra
  | TPs
  // TODO: investigate and if needed report as TS error `readonly [...TPs, unknown]` results in circular dependency
  //       `readonly [TPs[0], TPs[1], ARR<TREExpr<TPs>>]` is too loose on its own
  | (readonly [TPs[0], TPs[1], ARR<TREExpr<TPs, Extra>>] & readonly [...TPs, unknown]);

export type TREExprs<TPs extends TagParam = TagParam, Extra = never> = TREExpr<TPs, Extra> | ARR<TREExpr<TPs, Extra>>;

export default TREExprs;

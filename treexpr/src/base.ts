import { ARR } from "~types";
import { o, __ } from "composyo";

export type TagParam<Tag = string, Param = unknown> = readonly [Tag, Param];
export type TREExpr1<TPs extends TagParam = TagParam> =
  | TPs
  | (() => TPs)
  // TODO: investigate and if needed report as TS error `readonly [...TPs, unknown]` results in circular dependency
  //       `readonly [TPs[0], TPs[1], ARR<TREExpr<TPs>>]` is too loose on its own
  | (readonly [TPs[0], TPs[1], ARR<TREExpr1<TPs>>] & readonly [...TPs, unknown]);

export type TREExpr<TPs extends TagParam> = TREExpr1<TPs> | ARR<TREExpr1<TPs>>;

export const TREExpr = <TPs extends TagParam>() => o(__ as __<TREExpr<TPs>>);

const e = [] satisfies TREExpr<["a", "a"]>;

const t = TREExpr<["A", "a"]>()((x) => (typeof x === "function" ? x()[1] : x[0]));

export default TREExpr;

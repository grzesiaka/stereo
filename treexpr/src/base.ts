import { ARR, Dict, Fn } from "~types";
import { __ } from "composyo";
import { Head, Tail } from "arryo";
export { dethunk, Head, Tail } from "arryo";

export type TagParam<Tag = string, Param = unknown> = readonly [Tag, Param];
// TODO: if Kids were an array they could be interpeted as next echons
export type $TREExpr<TPs extends TagParam = TagParam, Extra = never, Kids extends ARR<TagParam> = ARR<TPs>> =
  | Extra
  | TPs
  // TODO: investigate and if needed report as TS error `readonly [...TPs, unknown]` results in circular dependency
  //       `readonly [TPs[0], TPs[1], ARR<TREExpr<TPs>>]` is too loose on its own
  | (readonly [TPs[0], TPs[1], ARR<$TREExpr<Head<Kids> extends TagParam ? Head<Kids> : TagParam, Extra, Tail<Kids>>>] &
      readonly [...TPs, unknown]);

export type TREExpr<TPs extends TagParam = TagParam> = $TREExpr<TPs>;

type A = $TREExpr<
  ["0", "zero"],
  never,
  [["1", "one"] | ["2", "two"] | ["3", string], ["a", "a"] | ["b", "b"] | ["ab", "ab"]]
>;
const a = [
  "0",
  "zero",
  [
    ["3", "three"],
    [
      "1",
      "one",
      [
        ["a", "a"],
        ["ab", "ab"],
      ],
    ],
    [
      "2",
      "two",
      [
        ["ab", "ab"],
        ["a", "a"],
      ],
    ],
  ],
] as const satisfies A;

// export type TREExprs<TE extends TREExpr, Extra = never> = Extra | TE | ARR<TE | Extra>;
export type TREExprs<TPs extends TagParam = TagParam, Extra = never> = $TREExpr<TPs, Extra> | ARR<$TREExpr<TPs, Extra>>;

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

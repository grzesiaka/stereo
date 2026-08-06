import { ARR, Dict, Fn } from "~types";

export type TreeOP<Params = any, Tag = string, FromRoot extends ARR = ARR, Kids extends ARR = ARR> = Fn<
  [params: Params, tag: Tag, from_root: FromRoot, kids?: Kids]
>;
export type TreeOPs = Dict<TreeOP>;

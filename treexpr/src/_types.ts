import { ARR, Dict, Fn } from "~types";

export type TreeFn<Params = any, Tag = string, FromRoot extends ARR = ARR, Kids extends ARR = ARR> = Fn<
  [params: Params, tag: Tag, from_root: FromRoot, kids?: Kids]
>;
export type TreeFns = Dict<TreeFn>;

import { ARR } from "~types";

import { TREExprs, TreeOP, TREExprs$TagParamStrict } from "./base";

type _MapArr<X, TreeXpr> = TreeXpr extends readonly [infer T, ...infer R] ? [Map<X, T>, ..._MapArr<X, R>] : [];

export type Map<OP_RES, T> = T extends readonly [string, unknown]
  ? OP_RES
  : T extends readonly [string, unknown, infer R]
    ? [OP_RES, _MapArr<OP_RES, R>]
    : _MapArr<OP_RES, T>;

export const map =
  <RES, cT extends TREExprs = TREExprs>(OP: TreeOP<TREExprs$TagParamStrict<cT>, RES>, fromRoot = [] as ARR) =>
  <T extends TREExprs<TREExprs$TagParamStrict<cT>>>(
    t: TREExprs<TREExprs$TagParamStrict<cT>> extends T ? cT : T,
  ): Map<RES, TREExprs<TREExprs$TagParamStrict<cT>> extends T ? cT : T> => {
    if (typeof t[0] === "string") {
      const kids = t[2]?.map(map(OP as never, [...fromRoot, t]) as never);
      const x = OP(t as never, fromRoot, kids);
      return (kids ? [x, kids] : x) as never;
    }
    return t.map(map(OP as never, fromRoot) as never) as never;
  };

export default map;

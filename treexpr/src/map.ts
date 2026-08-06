import { ARR, Fn$O } from "~types";

import { TREExprs, TreeOP, TREExprs$TagParamStrict, TreeOP$Result } from "./base";

type _MapArr<X, TreeXpr> = TreeXpr extends readonly [infer T, ...infer R] ? [Map<X, T>, ..._MapArr<X, R>] : [];

export type Map<OP_RES, T> = T extends readonly [string, unknown]
  ? OP_RES
  : T extends readonly [string, unknown, infer R]
    ? [OP_RES, _MapArr<OP_RES, R>]
    : _MapArr<OP_RES, T>;

export const map =
  <
    cT extends TREExprs = TREExprs,
    OP extends TreeOP<TREExprs$TagParamStrict<cT>> = TreeOP<TREExprs$TagParamStrict<cT>>,
  >(
    OP: OP,
    fromRoot = [] as ARR,
  ) =>
  <T extends TREExprs<TREExprs$TagParamStrict<cT>>>(
    t: TREExprs<TREExprs$TagParamStrict<cT>> extends T ? cT : T,
  ): Map<TreeOP$Result<OP>, TREExprs<TREExprs$TagParamStrict<cT>> extends T ? cT : T> => {
    if (typeof t[0] === "string") {
      const kids = t[2]?.map(map(OP as never, [t, ...fromRoot]) as never);
      const x = OP(t as never, fromRoot, kids);
      return (kids ? [x, kids] : x) as never;
    }
    return t.map(map(OP as never, fromRoot) as never) as never;
  };

export default map;

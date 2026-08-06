import { ARR, Fn$O } from "~types";

import { TREExprs, TagParam } from "./base";
import { TreeOP } from "./_types";

type _MapArr<X, TreeXpr> = TreeXpr extends readonly [infer T, ...infer R] ? [Map<X, T>, ..._MapArr<X, R>] : [];

export type Map<OP_RES, T> = T extends readonly [string, unknown]
  ? OP_RES
  : T extends readonly [string, unknown, infer R]
    ? [OP_RES, _MapArr<OP_RES, R>]
    : _MapArr<OP_RES, T>;

export const map =
  <
    TPs extends TagParam = TagParam<string, unknown>,
    cT extends TREExprs<TPs> = TREExprs<TPs>,
    OP extends TreeOP<TPs> = TreeOP<TPs>,
  >(
    OP: OP,
    fromRoot = [] as ARR,
  ) =>
  <T extends TREExprs<TPs>>(t: TREExprs<TPs> extends T ? cT : T): Map<Fn$O<OP>, TREExprs<TPs> extends T ? cT : T> => {
    if (typeof t[0] === "string") {
      const kids = t[2]?.map(map(OP as never, [t, ...fromRoot]) as never);
      const x = OP(t[1] as never, t[0], fromRoot, kids);
      return (kids ? [x, kids] : x) as never;
    }
    return t.map(map(OP as never, fromRoot) as never) as never;
  };

export default map;

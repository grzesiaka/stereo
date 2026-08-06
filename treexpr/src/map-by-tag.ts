import { ARR, Fn$I, Fn$O } from "~types";

import { TREExprs } from "./base";
import { TreeOP, TreeOPs } from "./_types";

/**
 * ReturnType of picked function or `NotFound` if no tag present in the bundle
 */
type MapSingleTag<Tag, MapBundle, Params> = Tag extends keyof MapBundle
  ? Params extends Fn$I<MapBundle[Tag]>[0]
    ? Fn$O<MapBundle[Tag]>
    : ["PARAMS_MISMATCH", { function_accepts: Fn$I<MapBundle[Tag]>; provided: Params }] | undefined
  : never;

type _MapArr<T, M> = T extends readonly [infer T, ...infer R] ? [_Map<T, M>, ..._MapArr<R, M>] : [];

type _Map<T, M> = T extends readonly [infer OP extends string, infer Params]
  ? MapSingleTag<OP, M, Params> extends never
    ? T
    : MapSingleTag<OP, M, Params>
  : T extends readonly [infer OP extends string, infer Params, infer R]
    ? [...(MapSingleTag<OP, M, Params> extends never ? [OP, Params] : [MapSingleTag<OP, M, Params>]), _MapArr<R, M>]
    : _MapArr<T, M>;

export type MapByTag<T extends TREExprs, M extends TreeOPs> = _Map<T, M>;

export const mapByTag =
  <M extends TreeOPs>(M: M) =>
  <T extends TREExprs>(fromRoot = [] as ARR) =>
  (t: T): MapByTag<T, M> => {
    if (typeof t[0] === "string") {
      const m = M[t[0]] as TreeOP | undefined;
      const kids = t[2]?.map(mapByTag(M)([...fromRoot, t] as any) as any);
      const x = m && m(t[1], t[0], fromRoot, kids);
      return (kids ? [...((m ? [x] : [t[0], t[1]]) as any[]), kids] : m ? x : t) as MapByTag<T, M>;
    }
    return t.map(mapByTag(M)(fromRoot as any) as any) as MapByTag<T, M>;
  };

export default mapByTag;

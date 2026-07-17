import { ARR, Fn$I, Fn$O } from "~types";

import { TREExprs } from "./base";
import { TreeFn, TreeFns } from "./_types";

/**
 * ReturnType of picked function or `NotFound` if no tag present in the bundle
 */
export type MapByTag<Tag, MapBundle, Params> = Tag extends keyof MapBundle
  ? Params extends Fn$I<MapBundle[Tag]>[0]
    ? Fn$O<MapBundle[Tag]>
    : ["PARAMS_MISMATCH", { function_accepts: Fn$I<MapBundle[Tag]>; provided: Params }] | undefined
  : never;

type _MapArr<T, M> = T extends readonly [infer T, ...infer R] ? [_Map<T, M>, ..._MapArr<R, M>] : [];

type _Map<T, M> = T extends readonly [infer OP extends string, infer Params]
  ? MapByTag<OP, M, Params> extends never
    ? T
    : MapByTag<OP, M, Params>
  : T extends readonly [infer OP extends string, infer Params, infer R]
    ? [...(MapByTag<OP, M, Params> extends never ? [OP, Params] : [MapByTag<OP, M, Params>]), _MapArr<R, M>]
    : _MapArr<T, M>;

export type Map<T extends TREExprs, M extends TreeFns> = _Map<T, M>;

export const mapByTag =
  <M extends TreeFns>(M: M) =>
  <T extends TREExprs, FromRoot extends ARR = []>(fromRoot = [] as never as FromRoot) =>
  (t: T): Map<T, M> => {
    if (typeof t[0] === "string") {
      const m = M[t[0]] as TreeFn | undefined;
      const kids = t[2]?.map(mapByTag(M)([t, ...fromRoot] as any) as any);
      const x = m && m(t[1], t[0], fromRoot, kids);
      return (kids ? [...((m ? [x] : [t[0], t[1]]) as any[]), kids] : m ? x : t) as Map<T, M>;
    }
    return t.map(mapByTag(M)(fromRoot as any) as any) as Map<T, M>;
  };

export default mapByTag;

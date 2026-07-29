import { MapTree, TreeOrLeaves, Tree$ValueKeyPairs } from "./types";

const defRec = (t: unknown): t is object => typeof t === "object" && !Array.isArray(t) && t !== null;
export const map =
  <T extends TreeOrLeaves>(t: T, rec = defRec, ks = "") =>
  <X>(f: (vk: Tree$ValueKeyPairs<T>) => X): MapTree<T, X> => {
    if (rec(t)) {
      return Object.entries(t).reduce((a, [k, v]) => {
        a[k] = map(v, rec, ks ? `${ks}.${k}` : k)(f as any);
        return a;
      }, {} as any);
    } else {
      return f([t as any, ks as any]) as any;
    }
  };

export default map;

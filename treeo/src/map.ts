import { MapTree, Tree, Tree$ValueKeyPairs } from "./types";

export const map =
  <T extends Tree>(t: T, ks = "") =>
  <X>(f: (vk: Tree$ValueKeyPairs<T>) => X): MapTree<T, X> => {
    if (typeof t === "object" && !Array.isArray(t) && t !== null) {
      return Object.entries(t).reduce((a, [k, v]) => {
        a[k] = map(v, ks ? `${ks}.${k}` : k)(f as any);
        return a;
      }, {} as any);
    } else {
      return f([t as any, ks as any]) as any;
    }
  };

export default map;

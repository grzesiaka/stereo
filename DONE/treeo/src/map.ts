import { MapTree, TreeOrLeaves, Tree$ValueKeyPairs } from "./types";

export const defaultKeepTraversing = (item: unknown, _path: string): item is object =>
  typeof item === "object" && !Array.isArray(item) && item !== null;

export const map =
  <X, T extends TreeOrLeaves>(f: (vk: Tree$ValueKeyPairs<T>) => X, keepTraversing = defaultKeepTraversing) =>
  (item: T, path = ""): MapTree<T, X> => {
    if (keepTraversing(item, path)) {
      return Object.entries(item).reduce((a, [k, v]) => {
        a[k] = map(f, keepTraversing)(v, path ? `${path}.${k}` : k);
        return a;
      }, {} as any);
    } else {
      return f([item as any, path as any]) as any;
    }
  };

map._ =
  <T extends TreeOrLeaves>(item: T, keepTraversing = defaultKeepTraversing, path = "") =>
  <X>(f: (vk: Tree$ValueKeyPairs<T>) => X): MapTree<T, X> =>
    map(f, keepTraversing)(item, path);

export default map;

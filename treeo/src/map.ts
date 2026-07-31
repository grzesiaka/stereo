import { MapTree, TreeOrLeaves, Tree$ValueKeyPairs } from "./types";

// export const map_ =
//   <T extends TreeOrLeaves>(item: T, rec = defRec, path = "") =>
//   <X>(f: (vk: Tree$ValueKeyPairs<T>) => X): MapTree<T, X> => {
//     if (rec(item, path)) {
//       return Object.entries(item).reduce((a, [k, v]) => {
//         a[k] = map_(v, rec, path ? `${path}.${k}` : k)(f as any);
//         return a;
//       }, {} as any);
//     } else {
//       return f([item as any, path as any]) as any;
//     }
//   };

const defRec = (item: unknown, _path: string): item is object =>
  typeof item === "object" && !Array.isArray(item) && item !== null;

export const map =
  <X, T extends TreeOrLeaves>(f: (vk: Tree$ValueKeyPairs<T>) => X, rec = defRec) =>
  (item: T, path = ""): MapTree<T, X> => {
    if (rec(item, path)) {
      return Object.entries(item).reduce((a, [k, v]) => {
        a[k] = map(f, rec)(v, path ? `${path}.${k}` : k);
        return a;
      }, {} as any);
    } else {
      return f([item as any, path as any]) as any;
    }
  };

map._ =
  <T extends TreeOrLeaves>(item: T, rec = defRec, path = "") =>
  <X>(f: (vk: Tree$ValueKeyPairs<T>) => X): MapTree<T, X> =>
    map(f, rec)(item, path);

export default map;

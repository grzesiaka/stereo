import { TreeOrLeaves, Tree$ValueKeyPairs } from "./types";
import m, { defaultKeepTraversing } from "./map";

export const reduce =
  <X, T extends TreeOrLeaves>(
    x: X,
    f: (x: X, vk: Tree$ValueKeyPairs<T>) => void,
    keepTraversing = defaultKeepTraversing,
  ) =>
  (t: T) => {
    m((vk) => f(x, vk as Tree$ValueKeyPairs<T>), keepTraversing)(t);
    return x;
  };

reduce._ =
  <T extends TreeOrLeaves>(t: T, keepTraversing = defaultKeepTraversing) =>
  <X>(x: X, f: (x: X, vk: Tree$ValueKeyPairs<T>) => void) =>
    reduce(x, f, keepTraversing)(t);

export default reduce;

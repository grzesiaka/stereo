import { TreeOrLeaves, Tree$ValueKeyPairs } from "./types";
import m from "./map";

export const reduce =
  <T extends TreeOrLeaves>(t: T) =>
  <X>(x: X, f: (x: X, vk: Tree$ValueKeyPairs<T>) => void) => {
    m(t)((vk) => f(x, vk));
    return x;
  };

export default reduce;

import { Tree, Tree$ValueKeyPairs } from "./types";
import m from "./map";

export const reduce =
  <T extends Tree>(t: T) =>
  <X>(x: X, f: (x: X, vk: Tree$ValueKeyPairs<T>) => void) => {
    m(t)((vk) => f(x, vk));
    return x;
  };

export default reduce;

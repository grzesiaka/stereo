import { Get, Paths, Simplify } from "type-fest";
import { Tree } from "./types";
import { reduce } from "./reduce";

export type Flatten<T> = { [K in Paths<T, { leavesOnly: true }> & string]: Get<T, K> };

export const flatten = <T extends Tree, X extends {} = {}>(t: T, acc = {} as X) =>
  reduce(t)(acc as any, (x, [v, k]) => (x[k] = v)) as Simplify<X & Flatten<T>>;

export default flatten;

import map from "./map";
import set from "./set";
import { Tree, Tree$X } from "./types";

export type AwaitedTree<T> = { readonly [k: string]: any } extends T
  ? Awaited<Tree$X<T>>
  : T extends Promise<infer U>
    ? U
    : { [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K] extends Tree ? AwaitedTree<T[K]> : T[K] };

export type AwaiTreed<T> = AwaitedTree<T>;

export const keepTraversingAwait = (item: unknown, _path: string): item is object =>
  typeof item === "object" && !(item instanceof Promise) && !Array.isArray(item) && item !== null;

export const awaiT = <const T extends Tree | Promise<unknown>>(tree: T) => {
  if (tree instanceof Promise) return tree;
  const r = {};
  const pending = [] as Promise<unknown>[];
  map(([v, k]) => {
    if (v instanceof Promise) {
      pending.push(v.then((x) => set(k, x)(r)));
    } else {
      set(k, v)(r);
    }
  }, keepTraversingAwait)(tree);
  return Promise.all(pending).then(() => {
    return r;
  }) as Promise<AwaitedTree<T>>;
};

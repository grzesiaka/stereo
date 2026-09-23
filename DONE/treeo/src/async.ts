import map from "./map";
import set from "./set";
import { Tree, Tree$X } from "./types";

export type AwaitedTree<T> = { readonly [k: string]: any } extends T
  ? Awaited<Tree$X<T>>
  : T extends Promise<infer U>
    ? U
    : { [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K] extends Tree ? AwaitedTree<T[K]> : T[K] };

export type AwaiTreed<T> = AwaitedTree<T>;

const keepTraversingAwait = (item: unknown, _path: string): item is object =>
  typeof item === "object" && !(item instanceof Promise) && !Array.isArray(item) && item !== null;

const $awaiT =
  (map1?: (x: unknown, path: string) => unknown) =>
  <const T extends Tree | Promise<unknown>>(tree: T) => {
    if (tree instanceof Promise) return tree;
    const r = {};
    const pending = [] as Promise<unknown>[];
    map(([_v, k]) => {
      const v = map1 ? map1(_v, k) : _v;
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

export const awaiT = $awaiT() as ReturnType<typeof $awaiT> & { $: typeof $awaiT };
awaiT.$ = $awaiT;

export default awaiT;

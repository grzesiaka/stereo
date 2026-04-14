import { LastArrayElement } from "type-fest";

import { $Atom } from "../atoms/index";
import { Arr, Obj, Tup, Uni, $Compound } from "../compounds/index";

import { map, type Tree } from "treeo";
import { Join } from "jsyoyo";
import { Fn$O } from "~types";

type Leaf = <$TYP extends string, $KEY extends string = $TYP>(
  $TYP: $TYP,
  $KEY?: $KEY,
) => $Atom<any, any, $TYP, $KEY, any> | $Compound<any, $TYP, $KEY>;

type ToTypier<T, P extends readonly string[] = []> = T extends Leaf
  ? Fn$O<T> extends $Atom<infer S, infer T, string, string, infer M>
    ? $Atom<S, T, Join<P, ".">, LastArrayElement<P>, M>
    : Fn$O<T> extends Uni<infer I, infer S, string, string>
      ? Uni<I, S, Join<P, ".">, LastArrayElement<P>>
      : Fn$O<T> extends Obj<infer I, infer S, string, string>
        ? Obj<I, S, Join<P, ".">, LastArrayElement<P>>
        : Fn$O<T> extends Tup<infer I, infer S, string, string>
          ? Tup<I, S, Join<P, ".">, LastArrayElement<P>>
          : Fn$O<T> extends Arr<infer I, infer S, string, string>
            ? Arr<I, S, Join<P, ".">, LastArrayElement<P>>
            : never
  : T extends { readonly [K: string]: any }
    ? {
        [K in keyof T & string]: ToTypier<T[K], [...P, K]>;
      }
    : never;

/**
 * A fast creation of atoms and compounds with $TYP and $KEY populated from the tree path
 * @param tree
 * @returns
 */
export const fromTree = <const T extends Tree<Leaf>>(tree: T) =>
  map(tree)(([v, k]) => (v as any)(k, k.split(".").pop())) as any as ToTypier<T>;

export default fromTree;

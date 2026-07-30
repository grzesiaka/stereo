import { LastArrayElement } from "type-fest";

import { $Atom, BOOL, ENUM, NUMBER, STRING } from "../atoms/index";
import { ARRAY, OBJECT, TUPLE, UNION } from "../compounds/index";

import { map, type Tree } from "treeo";
import { Join } from "jsyoyo";
import { Fn$O } from "~types";
import { TypT } from "../0";

type $Leaf = <$TYP extends string>($TYP: $TYP, $KEY?: any) => TypT<$TYP, any>; // TODO: somehow $KEY extends string makes Typescript unhappy. Better Ts be happy.

export type TreeToTypT<T, P extends readonly string[] = []> = T extends $Leaf
  ? Fn$O<T> extends BOOL<infer S>
    ? BOOL<S, Join<P, ".">, LastArrayElement<P>>
    : Fn$O<T> extends NUMBER<infer S>
      ? NUMBER<S, Join<P, ".">, LastArrayElement<P>>
      : Fn$O<T> extends STRING<infer S>
        ? STRING<S, Join<P, ".">, LastArrayElement<P>>
        : Fn$O<T> extends ENUM<infer E, infer S>
          ? ENUM<E, S, Join<P, ".">, LastArrayElement<P>>
          : Fn$O<T> extends $Atom<infer S, infer T, string, string, infer M>
            ? $Atom<S, T, Join<P, ".">, LastArrayElement<P>, M>
            : Fn$O<T> extends UNION<infer I, infer S, string, string>
              ? UNION<I, S, Join<P, ".">, LastArrayElement<P>>
              : Fn$O<T> extends OBJECT<infer I, infer S, string, string>
                ? OBJECT<I, S, Join<P, ".">, LastArrayElement<P>>
                : Fn$O<T> extends TUPLE<infer I, infer S, string, string>
                  ? TUPLE<I, S, Join<P, ".">, LastArrayElement<P>>
                  : Fn$O<T> extends ARRAY<infer I, infer S, string, string>
                    ? ARRAY<I, S, Join<P, ".">, LastArrayElement<P>>
                    : never
  : T extends { readonly [K: string]: any }
    ? {
        [K in keyof T & string]: TreeToTypT<T[K], [...P, K]>;
      }
    : never;

/**
 * A fast creation of atoms and compounds with $TYP and $KEY populated from the tree path
 * @param tree
 * @returns
 */
export const fromTree = <const T extends Tree<$Leaf>>(tree: T) =>
  map(tree)(([v, k]) => (v as any)(k, k.split(".").pop())) as any as TreeToTypT<T>;

export default fromTree;

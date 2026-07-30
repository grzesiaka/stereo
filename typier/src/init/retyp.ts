import { $Atom, BOOL, ENUM, NUMBER, STRING } from "../atoms/index";
import { ARRAY, OBJECT, TUPLE, UNION } from "../compounds/index";

import { map, type Tree } from "treeo";
import { Join } from "jsyoyo";
import { TypT } from "../0";

export type RetypTree<T, P extends readonly string[] = []> =
  T extends TypT<any, infer KEY>
    ? T extends BOOL<infer S>
      ? BOOL<S, Join<P, ".">, KEY>
      : T extends NUMBER<infer S>
        ? NUMBER<S, Join<P, ".">, KEY>
        : T extends STRING<infer S>
          ? STRING<S, Join<P, ".">, KEY>
          : T extends ENUM<infer E, infer S>
            ? ENUM<E, S, Join<P, ".">, KEY>
            : T extends $Atom<infer S, infer T, string, string, infer M>
              ? $Atom<S, T, Join<P, ".">, KEY, M>
              : T extends UNION<infer I, infer S, string, string>
                ? UNION<I, S, Join<P, ".">, KEY>
                : T extends OBJECT<infer I, infer S, string, string>
                  ? OBJECT<I, S, Join<P, ".">, KEY>
                  : T extends TUPLE<infer I, infer S, string, string>
                    ? TUPLE<I, S, Join<P, ".">, KEY>
                    : T extends ARRAY<infer I, infer S, string, string>
                      ? ARRAY<I, S, Join<P, ".">, KEY>
                      : never
    : T extends { readonly [K: string]: any }
      ? {
          [K in keyof T & string]: RetypTree<T[K], [...P, K]>;
        }
      : never;

/**
 * Retype a tree of types. New types formed from tree paths.
 * @param tree
 * @returns
 */
export const reTYP$ = <const T extends Tree<TypT>>(tree: T) =>
  map(
    tree,
    (t): t is object => !("$TYP" in (t as any)),
  )(([v, k]: any) => {
    return (v as any).$(v.$KEY, k);
  }) as any as RetypTree<T>;

export default reTYP$;

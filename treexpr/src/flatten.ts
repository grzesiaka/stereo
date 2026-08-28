import { ARR } from "~types";
import { Tree } from "treeo";
import { Simplify } from "type-fest";
// import { TREEXPR } from "./base";
import { Join } from "jsyoyo";

export type ToTreeArr<T> = T extends readonly [infer H, ...infer R]
  ? ToTree<H> & ToTreeArr<R>
  : [] extends T
    ? {}
    : T extends ReadonlyArray<infer X>
      ? Tree<X>
      : {};

export type ToTree<T, SelfSymbol extends PropertyKey = "$"> = T extends readonly [string, unknown]
  ? {
      [K in T[0]]: { [K in SelfSymbol]: T };
    }
  : T extends readonly [string, unknown, any]
    ? {
        [K in T[0]]: Simplify<{ [K in SelfSymbol]: T } & ToTreeArr<T[2]>>;
      }
    : ToTreeArr<T>;

// export type ToTreeContent<T, Path extends ARR<string> = []> = 1;

export type ToObject_Arr<T, Path extends ARR<string> = []> = T extends readonly [infer H, ...infer R]
  ? _ToObject<H, Path> & ToObject_Arr<R, Path>
  : {};
export type _ToObject<T, Path extends ARR<string> = []> = T extends readonly [string, unknown]
  ? {
      [K in Join<[...Path, T[0]], ".">]: T;
    }
  : T extends readonly [string, unknown, any]
    ? {
        [K in Join<[...Path, T[0]], ".">]: T;
      } & ToObject_Arr<T[2], [...Path, T[0]]>
    : ToObject_Arr<T, Path>;

export type ToObject<T> = Simplify<_ToObject<T>>;

export type ToContent<T> = {
  [K in keyof _ToObject<T>]: _ToObject<T>[K] extends readonly [any, infer X, ...any] ? X : never;
};

// type O = ToObject<[["a", 0, [["aa", "0"]]]]>;
// type C = ToContent<[["a", 0, [["aa", "0"]]]]>;
// type T = ToTree<[["a", 0, [["aa", "0"]]]]>;

// export const toTree = <T extends ARR<TREEXPR>>(t: T) => t;

import type * as TF from "type-fest";
import { ARR, Fn, Fn0 } from "jsyoyo";

export type Tree<X = unknown> = X | { [k: string]: Tree<X> };
export type Tree$X<T> = T extends Tree<infer X> ? X : never;

export type Tree_of_Functions<Input extends ARR = ARR, Output = unknown> = Tree<Fn<Input, Output>>;
export type Tree_of_Thunks<Output = unknown> = Tree<Fn0<Output>>;

export type Tree_of_Functions$Tree_of_Outputs<T> = T extends { readonly [K in string]: any }
  ? { [K in keyof T]: Tree_of_Functions$Tree_of_Outputs<T[K]> }
  : T extends Fn
    ? ReturnType<T>
    : never;

export type Tree$ValueKeyPairs<T> = { [s: string]: Tree<any> } extends T
  ? [Tree$X<T>, string]
  : { [K in TF.Paths<T, { leavesOnly: true }> & string]: [TF.Get<T, K>, K] }[TF.Paths<T, { leavesOnly: true }> &
      string];

export type MapTree<T, X> = T extends Fn
  ? X
  : T extends ARR
    ? X
    : T extends { readonly [K in string]: any }
      ? { [K in keyof T]: MapTree<T[K], X> }
      : X;

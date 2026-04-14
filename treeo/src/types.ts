import type * as TF from "type-fest";
import { ARR, Fn, Fn0 } from "jsyoyo";

export type TreeOrLeaves<X = unknown> = X | { [k: string]: TreeOrLeaves<X> };
export type Tree<X = unknown> = { [k: string]: TreeOrLeaves<X> };
export type Tree$X<T> = T extends TreeOrLeaves<infer X> ? X : never;

export type Tree_of_Functions<Input extends ARR = ARR, Output = unknown> = TreeOrLeaves<Fn<Input, Output>>;
export type Tree_of_Thunks<Output = unknown> = TreeOrLeaves<Fn0<Output>>;

export type Tree_of_Functions$Tree_of_Outputs<T> = T extends { readonly [K in string]: any }
  ? { [K in keyof T]: Tree_of_Functions$Tree_of_Outputs<T[K]> }
  : T extends Fn
    ? ReturnType<T>
    : never;

export type Tree$ValueKeyPairs<T> = { [s: string]: TreeOrLeaves<any> } extends T
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

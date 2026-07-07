import { get, Get, Tree_of_Functions } from "treeo";
import { a, ARR, dethunk, Fn$O } from "jsyoyo";
import { Deact$AST } from "./deact";

type ActedArr<T extends Tree_of_Functions, MergeParams extends boolean, AST> = AST extends readonly [
  infer H extends Deact$AST<T>,
  ...infer R,
]
  ? [Acted<T, MergeParams, H>, ...ActedArr<T, MergeParams, R>]
  : [];

export type Acted<
  T extends Tree_of_Functions,
  MergeParams extends boolean,
  AST extends Deact$AST<T>,
> = AST extends readonly [infer FnId extends string, infer Params extends ARR]
  ? Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {})
  : AST extends ((...k: any[]) => infer FP extends Deact$AST<T>)
    ? Acted<T, MergeParams, FP>
    : AST extends readonly [infer FnId extends string, infer Params extends ARR, infer Kids]
      ? [] extends Kids
        ? Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {})
        : [Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {}), ActedArr<T, MergeParams, Kids>]
      : never;

export const acted =
  <T extends Tree_of_Functions, MergeParams extends boolean = false>(T: T, mergeParams = false as MergeParams) =>
  <AST extends Deact$AST<T>>(ast: AST): Acted<T, MergeParams, AST> => {
    const [id, p, k] = dethunk(ast);
    const x = get(id, T)(...p);
    const r = mergeParams ? a(x, p[0]) : x;
    return (!k ? r : [r, (k as ARR).map((a) => acted(T, mergeParams)(a))]) as any;
  };

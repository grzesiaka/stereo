import { Tree_of_Functions } from "treeo";
import { DeAST } from "./deact";
import { a, ARR, dethunk, Fn$O } from "jsyoyo";
import { Get } from "type-fest";

type ActedArr<T extends Tree_of_Functions, MergeParams extends boolean, AST> = AST extends readonly [
  infer H extends DeAST<T>,
  ...infer R,
]
  ? [Acted<T, MergeParams, H>, ...ActedArr<T, MergeParams, R>]
  : [];

export type Acted<
  T extends Tree_of_Functions,
  MergeParams extends boolean,
  AST extends DeAST<T>,
> = AST extends readonly [infer FnId extends string, infer Params extends ARR]
  ? Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {})
  : AST extends ((...k: any[]) => infer FP extends DeAST<T>)
    ? Acted<T, MergeParams, FP>
    : AST extends readonly [infer FnId extends string, infer Params extends ARR, infer Kids]
      ? [] extends Kids
        ? Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {})
        : [Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {}), ActedArr<T, MergeParams, Kids>]
      : never;

// TODO improve: add cache + move to treeo
const get = (op: string, x: object) => {
  const parts = op.split(".");
  let i = x as any;
  for (const p of parts) {
    i = i[p];
  }
  return i;
};

export const acted =
  <T extends Tree_of_Functions, MergeParams extends boolean = false>(T: T, mergeParams = false as MergeParams) =>
  <AST extends DeAST<T>>(ast: AST): Acted<T, MergeParams, AST> => {
    const [id, p, k] = dethunk(ast);
    const x = get(id, T)(...p);
    const r = mergeParams ? a(x, p[0]) : x;
    return (!k ? r : [r, (k as ARR).map((a) => acted(T, mergeParams)(a))]) as any;
  };

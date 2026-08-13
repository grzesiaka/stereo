import { get, Get, Getter, Tree_of_Functions } from "treeo";
import { a, ARR, dethunk, Fn$O } from "jsyoyo";
import { Deact$AST } from "./deact";

type ActArr<T extends Tree_of_Functions, MergeParams extends boolean, AST> = AST extends readonly [
  infer H extends Deact$AST<T>,
  ...infer R,
]
  ? [Act<T, MergeParams, H>, ...ActArr<T, MergeParams, R>]
  : [];

export type Act<
  T extends Tree_of_Functions,
  MergeParams extends boolean,
  AST extends Deact$AST<T>,
> = AST extends readonly [infer FnId extends string, infer Params extends ARR]
  ? Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {})
  : AST extends ((...k: any[]) => infer FP extends Deact$AST<T>)
    ? Act<T, MergeParams, FP>
    : AST extends readonly [infer FnId extends string, infer Params extends ARR, infer Kids]
      ? [] extends Kids
        ? Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {})
        : [Fn$O<Get<T, FnId>> & (MergeParams extends true ? Params[0] : {}), ActArr<T, MergeParams, Kids>]
      : never;

/**
 * Based on a tree `T` full of functions creates an interpreter for AST of `Deact<T>`.
 *
 * @remarks
 * Epictetus:
 * > It's not what happens to you, but how you react to it that matters.
 *
 * @param T a tree full of functions
 * @param mergeParams (optional) a flag controlling if params should be value- and type-merged with the result
 * @param getter (optiona) a getter for values - might be handy in case of re-using the cache
 * @returns a function accepting `AST extends Deact$AST<T>`
 *
 */
export const act =
  <T extends Tree_of_Functions, MergeParams extends boolean = false>(
    T: T,
    mergeParams = false as MergeParams,
    getter = get(T) as Getter<T>, // without `as Getter<T>` ts compiler breaks (6.0.3)
  ) =>
  <AST extends Deact$AST<T>>(ast: AST): Act<T, MergeParams, AST> => {
    const [id, p, k] = dethunk(ast);
    // @ts-expect-error getter type is strict
    const x = getter(id)(...p);
    const r = mergeParams ? a(x, p[0]) : x;
    return (!k ? r : [r, (k as ARR).map((a) => act(T, mergeParams)(a))]) as any;
  };

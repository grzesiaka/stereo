import type { ARR, Fn$O } from "jsyoyo";
import { Tree_of_Functions, Tree$Values } from "treeo";

export type AST<TagParams extends readonly [string, ARR]> =
  | TagParams
  | (() => TagParams)
  // TODO: investigate and if needed report as TS error `readonly [...TagParams, ARR<AST<TagParams>]` results in circular dependency
  //       `[TagParams[0], TagParams[1], ARR<AST<TagParams>>]` is too loose on its own
  | (readonly [TagParams[0], TagParams[1], ARR<AST<TagParams>>] & readonly [...TagParams, unknown]);

export type AST1<TagParam extends readonly [string, unknown] = [string, unknown]> =
  | TagParam
  | (() => TagParam)
  // TODO: investigate and if needed report as TS error `readonly [...TagParams, ARR<AST<TagParams>]` results in circular dependency
  //       `[TagParams[0], TagParams[1], ARR<AST<TagParams>>]` is too loose on its own
  | (readonly [TagParam[0], TagParam[1], ARR<AST1<TagParam>>] & readonly [...TagParam, unknown]);

export type FnsTree$AST<T extends Tree_of_Functions = Tree_of_Functions> =
  FnsTree$TagParams<T> extends [string, ARR] ? AST<FnsTree$TagParams<T>> : never;

export type FnsTree$TagParams<T extends Tree_of_Functions = Tree_of_Functions> =
  Fn$O<Fn$O<Tree$Values<T>>> extends [...infer H, any] ? H : never;

export type AST$TagParam<T> = T extends (...ps: any[]) => infer R
  ? AST$TagParam<R>
  : T extends readonly [infer K extends string, infer P]
    ? [K, P]
    : T extends readonly [infer K extends string, infer P, infer R]
      ? [K, P] | AST$TagParam<R>
      : T extends readonly (infer E)[]
        ? AST$TagParam<E>
        : never;

export type TagParam$MapByTag<T extends readonly [string, unknown], SkipKeys = never> = {
  [K in Exclude<T[0] & string, SkipKeys>]: (param: Extract<AST$TagParam<T>, [K, any]>[1]) => unknown;
};

export type TagParam$MapDefaultParams<T extends readonly [string, unknown], SkipKeys = never> = Exclude<
  T,
  readonly [SkipKeys, unknown?, unknown?]
>;

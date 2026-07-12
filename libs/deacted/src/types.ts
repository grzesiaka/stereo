import type { ARR, Fn$O } from "jsyoyo";
import { Tree_of_Functions, Tree$Values } from "treeo";

export type AST<FnIdParams extends readonly [string, ARR]> =
  | FnIdParams
  | (() => FnIdParams)
  // TODO: investigate and if needed report as TS error `readonly [...FnIdParams, ARR<AST<FnIdParams>]` results in circular dependency
  //       `[FnIdParams[0], FnIdParams[1], ARR<AST<FnIdParams>>]` is too loose on its own
  | (readonly [FnIdParams[0], FnIdParams[1], ARR<AST<FnIdParams>>] & readonly [...FnIdParams, unknown]);

export type AST1<FnIdParams extends readonly [string, unknown] = [string, unknown]> =
  | FnIdParams
  | (() => FnIdParams)
  // TODO: investigate and if needed report as TS error `readonly [...FnIdParams, ARR<AST<FnIdParams>]` results in circular dependency
  //       `[FnIdParams[0], FnIdParams[1], ARR<AST<FnIdParams>>]` is too loose on its own
  | (readonly [FnIdParams[0], FnIdParams[1], ARR<AST1<FnIdParams>>] & readonly [...FnIdParams, unknown]);

export type FnsTree$AST<T extends Tree_of_Functions = Tree_of_Functions> =
  FnsTree$FnIdParams<T> extends [string, ARR] ? AST<FnsTree$FnIdParams<T>> : never;

export type FnsTree$FnIdParams<T extends Tree_of_Functions = Tree_of_Functions> =
  Fn$O<Fn$O<Tree$Values<T>>> extends [...infer H, any] ? H : never;

export type AST$TagParamPairs<T> = T extends (...ps: any[]) => infer R
  ? AST$TagParamPairs<R>
  : T extends readonly [infer K extends string, infer P]
    ? [K, P]
    : T extends readonly [infer K extends string, infer P, infer R]
      ? [K, P] | AST$TagParamPairs<R>
      : T extends readonly (infer E)[]
        ? AST$TagParamPairs<E>
        : never;

export type AST$MapByTag<T, SkipKeys = never> = {
  [K in Exclude<AST$TagParamPairs<T>[0] & string, SkipKeys>]: (
    param: Extract<AST$TagParamPairs<T>, [K, any]>[1],
  ) => unknown;
};

export type AST$MapDefaultParams<T, SkipKeys = never> = Exclude<AST$TagParamPairs<T>, readonly [SkipKeys, any?, any?]>;

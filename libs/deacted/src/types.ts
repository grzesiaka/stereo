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

type _AST$Runner<T> = T extends (...ps: any[]) => readonly [infer T, infer P, unknown?]
  ? [T, P]
  : T extends readonly [infer T extends string, infer P]
    ? [T, P]
    : T extends readonly [infer T extends string, infer P, infer R]
      ? [T, P] | _AST$Runner<R>
      : T extends readonly (infer E)[]
        ? _AST$Runner<E>
        : never;
export type AST1$Runner<T> = { [K in _AST$Runner<T>[0] & string]: Extract<_AST$Runner<T>, [K, any]>[1] };

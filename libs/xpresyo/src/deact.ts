import { ARR, Fn, Fn$I, Fn$O } from "jsyoyo";
import { map, Tree_of_Functions, Tree$Values } from "treeo";

type _DeAST<FnIdParams extends readonly [string, ARR]> =
  | FnIdParams
  | (() => FnIdParams)
  // TODO: investigate and if needed report as TS error `readonly [...FnIdParams, ARR<_DeAST<FnIdParams>]` results in circular dependency
  //       `[FnIdParams[0], FnIdParams[1], ARR<_DeAST<FnIdParams>>]` is too loose on its own
  | (readonly [FnIdParams[0], FnIdParams[1], ARR<_DeAST<FnIdParams>>] & readonly [...FnIdParams, unknown]);

export type DeAST<T extends Tree_of_Functions = Tree_of_Functions> =
  Deact$FnIdParams<T> extends [string, ARR] ? _DeAST<Deact$FnIdParams<T>> : never;

export type Deact$FnIdParams<T extends Tree_of_Functions = Tree_of_Functions> =
  Fn$O<Fn$O<Tree$Values<Deact<T>>>> extends [...infer H, any] ? H : never;

export type Deact<T, P extends string = ""> = T extends Fn
  ? <I extends Fn$I<T>>(...I: I) => <const K extends ARR>(...kids: K) => K extends readonly [] ? [P, I] : [P, I, K]
  : { [K in keyof T & string]: Deact<T[K], "" extends P ? K : `${P}.${K}`> };

export const deact = <T extends Tree_of_Functions>(fns: T) =>
  map(fns)(
    ([_, k]) =>
      (...ps: any[]) =>
      (...kids: any[]) =>
        kids.length ? [k, ps, kids] : [k, ps],
  ) as Deact<T>;

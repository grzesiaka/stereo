import { ARR, Fn, Fn$I, Fn$O } from "jsyoyo";
import { map, Tree_of_Functions, Tree$Values } from "treeo";

export type _DeAST<FnIdParams extends readonly [string, ARR]> =
  | readonly [FnIdParams[0], FnIdParams[1]]
  | (() => readonly [FnIdParams[0], FnIdParams[1]])
  | readonly [FnIdParams[0], FnIdParams[1], ARR<_DeAST<FnIdParams>>];

export type DeAST<T> = Deactify<T> extends [string, ARR] ? _DeAST<Deactify<T>> : never;

type _Deactify<T, P extends string = ""> = T extends Fn
  ? () => [P, Fn$I<T>]
  : T extends { readonly [K in string]: any }
    ? { [K in keyof T & string]: _Deactify<T[K], P extends "" ? K : `${P}.${K}`> }
    : never;
export type Deactify<T> = Fn$O<Tree$Values<_Deactify<T>>>;

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

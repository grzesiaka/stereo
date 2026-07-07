import { ARR, Fn, Fn$I, Fn$O } from "jsyoyo";
import { map, Tree_of_Functions, Tree$Values } from "treeo";

export type AST<FnIdParams extends readonly [string, ARR]> =
  | FnIdParams
  | (() => FnIdParams)
  // TODO: investigate and if needed report as TS error `readonly [...FnIdParams, ARR<AST<FnIdParams>]` results in circular dependency
  //       `[FnIdParams[0], FnIdParams[1], ARR<AST<FnIdParams>>]` is too loose on its own
  | (readonly [FnIdParams[0], FnIdParams[1], ARR<AST<FnIdParams>>] & readonly [...FnIdParams, unknown]);

export type FnsTree$AST<T extends Tree_of_Functions = Tree_of_Functions> =
  FnsTree$FnIdParams<T> extends [string, ARR] ? AST<FnsTree$FnIdParams<T>> : never;

export type FnsTree$FnIdParams<T extends Tree_of_Functions = Tree_of_Functions> =
  Fn$O<Fn$O<Tree$Values<Deact<T>>>> extends [...infer H, any] ? H : never;

/**
 * Maps each function in a tree to a corresponding FunctionParams => Kids => [`${function.path}`, FunctionParams, Kids?].
 *
 * It allows creating loose AST with open interpretation. The initial tree of functions is possible / natural interpretation.
 *
 * @remarks
 * Viktor E. Frankl:
 * > Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.
 *
 * @param fns a tree full of functions
 * @returns a tree full of functions to create loose AST
 *
 *```
 *  export const deact = <T extends Tree_of_Functions>(fns: T) =>
 *    map(fns)(
 *      ([_, k]) =>
 *        (...ps: any[]) =>
 *        (...kids: any[]) =>
 *          kids.length ? [k, ps, kids] : [k, ps],
 *    ) as Deact<T>;
 * ```
 */
export const deact = <T extends Tree_of_Functions>(fns: T) =>
  map(fns)(
    ([_, k]) =>
      (...ps: any[]) =>
      (...kids: any[]) =>
        kids.length ? [k, ps, kids] : [k, ps],
  ) as Deact<T>;

export type Deact<T, P extends string = ""> = T extends Fn
  ? <I extends Fn$I<T>>(...I: I) => <const K extends ARR>(...kids: K) => K extends readonly [] ? [P, I] : [P, I, K]
  : { [K in keyof T & string]: Deact<T[K], "" extends P ? K : `${P}.${K}`> };

/**
 * Maps each function in a tree to a corresponding FunctionParams => Kids => [`${function.path}`, [FunctionOutput], Kids?].
 *
 * It allows creating loose AST with open interpretation.
 *
 * @remarks
 * Unfortunately it is not possible to create a generic `act` to strictly reflect Input->Output on the type level.
 *
 * @param fns a tree full of functions
 * @returns a tree full of functions to create loose AST
 *
 *```
 * export const act = <T extends Tree_of_Functions>(fns: T) =>
 *   map(fns)(
 *     ([f, k]) =>
 *       (...ps: any[]) =>
 *       (...kids: any[]) =>
 *         // @ts-expect-error f seems not callable
 *         kids.length ? [k, [f(...ps)], kids] : [k, f(...ps)],
 *   ) as Act<T>;
 * ```
 */
export const act = <T extends Tree_of_Functions>(fns: T) =>
  map(fns)(
    ([f, k]) =>
      (...ps: any[]) =>
      (...kids: any[]) =>
        // @ts-expect-error f seems not callable
        kids.length ? [k, [f(...ps)], kids] : [k, f(...ps)],
  ) as Act<T>;

export type Act<T, P extends string = ""> = T extends Fn
  ? <I extends Fn$I<T>>(
      ...I: I
    ) => <const K extends ARR>(...kids: K) => K extends readonly [] ? [P, [Fn$O<T>]] : [P, [Fn$O<T>], K] // Fn$O<T> does not depend on I
  : { [K in keyof T & string]: Act<T[K], "" extends P ? K : `${P}.${K}`> };

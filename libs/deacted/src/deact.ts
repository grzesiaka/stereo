import { Fn, Fn$I, Fn$O } from "jsyoyo";
import { map, Tree_of_Functions } from "treeo";
import { FnsTree$AST } from "./types";
import { DeactFn, deactFn } from "./fn/deact";

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
export const deact = <T extends Tree_of_Functions>(fns: T) => map(fns)(([_, k]) => deactFn()(k)) as Deact<T>;

export type Deact<T, P extends string = ""> = T extends Fn
  ? Fn$O<DeactFn<P, Fn$I<T>>>
  : { [K in keyof T & string]: Deact<T[K], "" extends P ? K : `${P}.${K}`> };

export type Deact$AST<T> = FnsTree$AST<Deact<T>>;

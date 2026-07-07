import { Tree_of_Functions, map } from "treeo";
import { ARR, Fn, Fn$I, Fn$O } from "~types";
/**
 * Maps each function in a tree to a corresponding FunctionParams => Kids => [`${function.path}`, [FunctionOutput], Kids?].
 *
 * It allows creating loose AST with open interpretation.
 *
 * @remarks
 * Unfortunately it is not possible to create a generic `acted` to strictly reflect Input->Output on the type level.
 *
 * @param fns a tree full of functions
 * @returns a tree full of functions to create loose AST
 *
 *```
 * export const acted = <T extends Tree_of_Functions>(fns: T) =>
 *   map(fns)(
 *     ([f, k]) =>
 *       (...ps: any[]) =>
 *       (...kids: any[]) =>
 *         // @ts-expect-error f seems not callable
 *         kids.length ? [k, [f(...ps)], kids] : [k, f(...ps)],
 *   ) as Acted<T>;
 * ```
 */
export const acted = <T extends Tree_of_Functions>(fns: T) =>
  map(fns)(
    ([f, k]) =>
      (...ps: any[]) =>
      (...kids: any[]) =>
        // @ts-expect-error f seems not callable
        kids.length ? [k, [f(...ps)], kids] : [k, f(...ps)],
  ) as Acted<T>;

export type Acted<T, P extends string = ""> = T extends Fn
  ? <I extends Fn$I<T>>(
      ...I: I
    ) => <const K extends ARR>(...kids: K) => K extends readonly [] ? [P, [Fn$O<T>]] : [P, [Fn$O<T>], K] // Fn$O<T> does not depend on I
  : { [K in keyof T & string]: Acted<T[K], "" extends P ? K : `${P}.${K}`> };

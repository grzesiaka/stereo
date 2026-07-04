import type { ARR } from "jsyoyo";
import { map, Tree_of_Functions, Tree$Values } from "treeo";
import { Fn, Fn$I, Fn$O_Recursive } from "~types";

type CommandLeaf<T> =
  | Extract<Fn$O_Recursive<Tree$Values<T>>, readonly [any, any]>
  | (() => Extract<Fn$O_Recursive<Tree$Values<T>>, readonly [any, any]>);

// an auxiliary type to force union distribution
type CommandNodeMap<U, T, Extra> = U extends readonly [infer K, infer Ps, any]
  ? [K, Ps, ARR<CommandNode<T, Extra> | Extra>?]
  : never;

type CommandNode<T, Extra> = CommandNodeMap<Fn$O_Recursive<Tree$Values<T>>, T, Extra>;

export type Command<T> = CommandLeaf<T> | CommandNode<T, CommandLeaf<T>>;

type CommandLeafBase<K extends string = string, Params extends ARR = ARR> = [K, Params];
type CommandBase<
  K extends string = string,
  Params extends ARR = ARR,
  Kids extends ARR<CommandLeafBase | CommandBase> = ARR<any>,
> = [K, Params, Kids] | CommandLeafBase;

export type CommandifyLeaves<T, P extends string = ""> = T extends Fn
  ? <I extends Fn$I<T>>(...I: I) => [P, I]
  : { [K in keyof T & string]: CommandifyLeaves<T[K], "" extends P ? `${K}` : `${P}.${K}`> };

export const commandifyLeaves = <T extends Tree_of_Functions>(fns: T) =>
  map(fns)(([_, k]) => (...ps: any) => [k, ps]) as CommandifyLeaves<T>;

export type Commandify<T, Constraint = CommandBase, P extends string = ""> = T extends Fn
  ? <I extends Fn$I<T>>(
      ...I: I
    ) => <const K extends ARR<Constraint>>(...kids: K) => K extends readonly [] ? [P, I] : [P, I, K]
  : { [K in keyof T & string]: Commandify<T[K], Constraint, "" extends P ? `${K}` : `${P}.${K}`> };

export const $commandify =
  <KidsConstraint>() =>
  <T extends Tree_of_Functions>(fns: T) =>
    map(fns)(
      ([_, k]) =>
        (...ps: any[]) =>
        (...kids: any[]) =>
          kids.length ? [k, ps, kids] : [k, ps],
    ) as Commandify<T, KidsConstraint>;
export const commandify = $commandify<CommandBase>();

export default commandify;

import { map, Tree_of_Functions } from "treeo";
import { Fn, Fn$I } from "~types";

export type CommandifyLeaves<T, P extends string = ""> = T extends Fn
  ? <I extends Fn$I<T>>(...I: I) => [P, I]
  : { [K in keyof T & (string | number)]: CommandifyLeaves<T[K], "" extends P ? `${K}` : `${P}.${K}`> };

export const commandifyLeaves = <T extends Tree_of_Functions>(fns: T) =>
  map(fns)(([_, k]) => (...ps: any) => [k, ps]) as CommandifyLeaves<T>;

import { Tree } from "treeo";
import $, { RetypTree } from "./retyp";
import { TypT } from "../0";

export type RetypePrefix<P extends string, T> = RetypTree<{ [p in P]: T }>[P & keyof RetypTree<{ [p in P]: T }>];

export const prefixTYP$ =
  <const P extends string, const cT extends Tree<TypT>>(prefix: P) =>
  <const T extends Tree<TypT>>(tree: Tree<TypT> extends T ? cT : T) =>
    $({ [prefix]: tree })[prefix] as never as RetypePrefix<P, Tree<TypT> extends T ? cT : T>;

export default prefixTYP$;

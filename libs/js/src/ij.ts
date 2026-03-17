import type { __ } from "./";
import { ARR } from "~types";

// TODO ij-deep for deeply nested projections if needed

type ij_Project1<K extends __<PropertyKey>, Xs> = Xs extends readonly [infer I, ...infer R]
  ? K extends PropertyKey
    ? [I extends { [k in K]: infer X } ? X : unknown, ...ij_Project1<K, R>]
    : [I, ...ij_Project1<K, R>]
  : [];

type ij_Item<ij, Item> = ij extends readonly [infer I, ...infer J]
  ? [I extends PropertyKey ? (Item extends { [i in I]: infer X } ? X : unknown) : Item, ...ij_Item<J, Item>]
  : [];

type ij_Project_<ij, Xs extends ARR> = Xs extends readonly [infer I, ...infer R]
  ? [ij_Item<ij, I>, ...ij_Project_<ij, R>]
  : [];

export type ij_Project<ij extends ARR, Xs extends ARR> = ij extends readonly [infer K extends __<PropertyKey>]
  ? ij_Project1<K, Xs>
  : ij_Project_<ij, Xs>;

/**
 * Projection from array by selected indices
 * 
 * ```
 * ij.length === 1
    ? <const Xs extends ARR>(xs: Xs): ij_Project<ij, Xs> =>
        (ij[0] === void 0 ? xs : xs.map((x) => x[ij[0] as 0])) as ij_Project<ij, Xs>
    : <const Xs extends ARR>(xs: Xs): ij_Project<ij, Xs> =>
        xs.map((x) => ij.map((i) => (i === void 0 ? x : x[i]))) as ij_Project<ij, Xs>;
 * ```
 * 
 * @param ij indices to project; `void 0` projects the whole item
 * @returns array of tuples with projected values (`ij.length !== 1`) or array with projected value (`ij.length === 1`)
 */
export const ij = <ij extends ARR<__<PropertyKey>>>(...ij: ij) =>
  ij.length === 1
    ? <const Xs extends ARR>(xs: Xs): ij_Project<ij, Xs> =>
        (ij[0] === void 0 ? xs : xs.map((x) => x[ij[0] as 0])) as ij_Project<ij, Xs>
    : <const Xs extends ARR>(xs: Xs): ij_Project<ij, Xs> =>
        xs.map((x) => ij.map((i) => (i === void 0 ? x : x[i]))) as ij_Project<ij, Xs>;

export default ij;

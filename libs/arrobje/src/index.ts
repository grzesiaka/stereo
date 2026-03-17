import { __, ARR } from "~types";
import { Simplify } from "type-fest";
import { ij_Project } from "~js/ij.mjs";
import { a } from "~js";

export type KeyValues$Object<Xs> = Xs extends readonly [[infer K, infer V], ...infer R]
  ? (K extends PropertyKey ? { [k in K]: V } : {}) & KeyValues$Object<R>
  : {};

export type ArrObje<
  Xs extends ARR,
  IdK extends PropertyKey,
  ValueK extends __<PropertyKey> = __,
  AnchorK extends PropertyKey | null = "$",
> = ij_Project<[ValueK], Xs> &
  (AnchorK extends string
    ? { [A in AnchorK]: Simplify<KeyValues$Object<ij_Project<[IdK, ValueK], Xs>>> }
    : Simplify<KeyValues$Object<ij_Project<[IdK, ValueK], Xs>>>);

const $ =
  <IdK extends PropertyKey = "id", ValueK extends __<PropertyKey> = __, AnchorK extends string | null = "$">(
    idKey = "id" as IdK,
    valueKey = void 0 as ValueK,
    anchorKey = "$" as AnchorK,
  ) =>
  <const Xs extends ARR>(xs: Xs) => {
    const $ = {} as any;
    const r = xs.map((x: any) => {
      const k = x[idKey];
      const v = valueKey === void 0 ? x : x[valueKey];
      $[k] = v;
      return v;
    });
    return a(r, anchorKey === null ? $ : { [anchorKey]: $ }) as ArrObje<Xs, IdK, ValueK, AnchorK>;
  };

/**
 * Result of `.$()`. Please reference `.$`.
 */
export const arrObje = a($(), {
  /**
   * It projects a tuple to a selected field, and at the same time it creates indexed object based on another field.
   *
   * @example
   *
   * ```
   * arrObje.$('key', 'value', '__')([{ key: 'A', value: 'a' }, { key: 'B', value: 'b' }, { key: 'C', value: 'c' }]); // ['a', 'b', 'c'] & { __: { A: 'a', B: 'b', C: 'c' }}
   * ```
   *
   *
   * @param idKey Property name that will be used as field in the projected object. Non `PropertyKey` values will not be reflected in the resulting type signature, but there is no runtime check if selected field indeed results in a `PropertyKey`. (*default*: `"id"`)
   * @param valueKey Property name to project; provide `undefined` to project the whole object (*default*: `undefined`)
   * @param anchorKey Name of the property under which the indexed object will be attached to the result tuple; provide `null` to merge object and the tuple (*default*: `"$"`)
   * @returns a tuple with indexed object
   */
  $,
});

export default arrObje;

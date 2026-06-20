import { TTupleOptions, TTuple } from "typebox";
import { createCompound, $Compound, TSchema } from "./0";

export type TUPLE<
  Items extends TSchema[] = TSchema[],
  Options extends TTupleOptions = TTupleOptions,
  $TYP extends string = string,
  $KEY extends string = string,
> = TTuple<Items> &
  $Compound<
    TTuple<Items> &
      Options & {
        type: "array";
        "~kind": "Tuple";
        minItems: Items["length"];
        additionalItems: false;
      },
    $TYP,
    $KEY
  >;
/**
 * Create Tuple compound
 * @param items
 * @param options
 * @returns
 */
export const $Tup = <const Items extends TSchema[], const Options extends TTupleOptions>(
  items: Items,
  options?: Options,
) =>
  createCompound({
    ...options,
    items,
    minItems: items.length,
    additionalItems: false,
    type: "array",
    "~kind": "Tuple",
  } as any) as <const $TYP extends string, const $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY?: $KEY,
    // this type gymnastics is kind of weird; not sure if there is some regression in TS 6.x
  ) => TUPLE<Items, TTupleOptions extends Options ? {} : Options, $TYP, string extends $KEY ? $TYP : $KEY>;
/**
 * Create Tuple compound with no options.
 * Use `.$` for full constructor
 * @param items
 * @returns
 */
export const Tup = <const Items extends TSchema[]>(...items: Items) => $Tup(items);
Tup.$ = $Tup;
export default Tup;

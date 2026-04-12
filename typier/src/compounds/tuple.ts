import { TTupleOptions, TTuple, TSchema } from "typebox";
import { createCompound, $Compound } from "./0";

export type Tup<
  Items extends TSchema[],
  Options extends TTupleOptions,
  $TYP extends string,
  $KEY extends string,
> = TTuple<Items> &
  $Compound<
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
  ) => Tup<Items, TTupleOptions extends Options ? {} : Options, $TYP, string extends $KEY ? $TYP : $KEY>;
/**
 * Create Tuple compound with no options.
 * Use `.$` for full constructor
 * @param items
 * @returns
 */
export const Tup = <const Items extends TSchema[]>(...items: Items) => $Tup(items);
Tup.$ = $Tup;
export default Tup;

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

export const Tup = <const Items extends TSchema[], const Options extends TTupleOptions>(
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

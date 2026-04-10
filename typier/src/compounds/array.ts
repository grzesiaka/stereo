import { TArrayOptions, TArray, TSchema } from "typebox";
import { createCompound, $Compound } from "./0";

export type Arr<
  Items extends TSchema,
  Options extends TArrayOptions,
  $TYP extends string,
  $KEY extends string,
> = TArray<Items> &
  $Compound<
    Options & {
      type: "array";
      "~kind": "Array";
    },
    $TYP,
    $KEY
  >;

export const Arr = <const Items extends TSchema, const Options extends TArrayOptions>(
  items: Items,
  options?: Options,
) =>
  createCompound({
    ...options,
    items,
    type: "array",
    "~kind": "Array",
  } as any) as <const $TYP extends string, const $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY?: $KEY,
    // this type gymnastics is kind of weird; not sure if there is some regression in TS 6.x
  ) => Arr<Items, TArrayOptions extends Options ? {} : Options, $TYP, string extends $KEY ? $TYP : $KEY>;

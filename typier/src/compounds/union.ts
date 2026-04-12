import { TUnion, TSchema, TSchemaOptions } from "typebox";
import { createCompound, $Compound } from "./0";
import { Null } from "../atoms";

export type Uni<
  Items extends TSchema[],
  Options extends TSchemaOptions,
  $TYP extends string,
  $KEY extends string,
> = TUnion<Items> &
  $Compound<
    Options & {
      "~kind": "Union";
    },
    $TYP,
    $KEY
  >;

export const $Uni = <const AnyOf extends TSchema[], const Options extends TSchemaOptions>(
  anyOf: AnyOf,
  options?: Options,
) =>
  createCompound({
    ...options,
    anyOf,
    "~kind": "Union",
  } as any) as <const $TYP extends string, const $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY?: $KEY,
    // this type gymnastics is kind of weird; not sure if there is some regression in TS 6.x
  ) => Uni<AnyOf, TSchemaOptions extends Options ? {} : Options, $TYP, string extends $KEY ? $TYP : $KEY>;

export const Uni = <const AnyOf extends TSchema[]>(...anyOf: AnyOf) => $Uni(anyOf);
Uni.$ = $Uni;
Uni._ = <const AnyOf extends TSchema[]>(...anyOf: AnyOf) => $Uni([...anyOf, Null()]);

export default Uni;

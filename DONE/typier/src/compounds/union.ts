import { TUnion, TSchemaOptions } from "typebox";
import { createCompound, $Compound, TSchema } from "./0";
import { Null } from "../atoms";

export type UNION<
  Items extends TSchema[] = TSchema[],
  Options extends TSchemaOptions = {},
  $TYP extends string = string,
  $KEY extends string = string,
> = TUnion<Items> &
  $Compound<
    TUnion<Items> &
      Options & {
        type: "union";
        "~kind": "Union";
      },
    $TYP,
    $KEY
  >;

/**
 * Create Union compound
 * @param anyOf
 * @param options
 * @returns
 */
export const $Uni = <const AnyOf extends TSchema[], const Options extends TSchemaOptions>(
  anyOf: AnyOf,
  options?: Options,
) =>
  createCompound({
    ...options,
    anyOf,
    type: "union",
    "~kind": "Union",
  } as any) as <const $TYP extends string, const $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY?: $KEY,
    // this type gymnastics is kind of weird; not sure if there is some regression in TS 6.x
  ) => UNION<AnyOf, TSchemaOptions extends Options ? {} : Options, $TYP, string extends $KEY ? $TYP : $KEY>;
/**
 * Create Union compound with no options.
 * Use `.$` for full constructor
 * @param anyOf
 * @returns
 */
export const Uni = <const AnyOf extends TSchema[]>(...anyOf: AnyOf) => $Uni(anyOf);
Uni.$ = $Uni;
Uni._ = <const AnyOf extends TSchema[]>(...anyOf: AnyOf) => $Uni([...anyOf, Null()]);

export default Uni;

// import { Simplify } from "type-fest"; // TODO it actually makes the type less readable
import { Enum as _Enum, TEnumValue, TSchemaOptions } from "typebox/type";
import { ARR } from "~types";
import { createAtom, $Atom } from "./_";
import { a } from "jsyoyo";

export type Enum<
  Enums extends ARR<TEnumValue>,
  Options extends TSchemaOptions,
  $TYP extends string,
  $KEY extends string,
> = $Atom<Options & { enum: Enums }, Enums[number], $TYP, $KEY, Enums>;

type CreateEnum = <
  const Enums extends ARR<TEnumValue>,
  const Options extends TSchemaOptions & { default?: Enums[number] },
>(
  enums: Enums,
  options?: Options,
) => <$TYP extends string, $KEY extends string = $TYP>($TYP: $TYP, $KEY?: $KEY) => Enum<Enums, Options, $TYP, $KEY>;

export const Enum: CreateEnum = (enums, options?) =>
  createAtom(
    a(
      {
        enum: enums,
      },
      options,
    ),
  ) as never;

export default Enum;

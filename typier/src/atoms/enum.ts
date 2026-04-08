// import { Simplify } from "type-fest"; // TODO it actually makes the type less readable
import { Enum as _Enum, TEnumValue, TSchemaOptions } from "typebox/type";
import { ARR } from "~types";
import { createAtom, $Atom } from "./_";
import { a } from "jsyoyo";

export type Enum<
  Enums extends ARR<TEnumValue>,
  Options extends TSchemaOptions,
  Tag extends string,
  Key extends string,
> = $Atom<Options & { enum: Enums }, Enums[number], Tag, Key, Enums>;

type CreateEnum = <
  const Enums extends ARR<TEnumValue>,
  const Options extends TSchemaOptions & { default?: Enums[number] },
>(
  enums: Enums,
  options?: Options,
) => <Tag extends string, Key extends string = Tag>(Tag: Tag, Key?: Key) => Enum<Enums, Options, Tag, Key>;

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

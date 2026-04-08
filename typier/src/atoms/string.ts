import type { TStringOptions } from "typebox";
import { $Atom, createAtom } from "./_";
import { __ } from "~types";
import { a } from "jsyoyo";
import type { Remove, Join } from "jsyoyo";

type Options$MinLength<O extends TStringOptions> = O extends { readonly minLength: infer L extends number }
  ? `${L}<=`
  : "";
type Options$MaxLength<O extends TStringOptions> = O extends { readonly maxLength: infer L extends number }
  ? `<=${L}`
  : "";
type Options$Length<O extends TStringOptions> = `${Options$MinLength<O>}${Options$MaxLength<O>}` extends ""
  ? ""
  : `${Options$MinLength<O>}length${Options$MaxLength<O>}`;
type Options$Pattern<O extends TStringOptions> = O extends { readonly pattern: infer P }
  ? P extends string
    ? `/${P}/`
    : "//"
  : "";

type Options$Format<O extends TStringOptions> = O extends { readonly format: infer F }
  ? F extends string
    ? `<${F}>`
    : "<>"
  : "";

type Option$TagInfo<O extends TStringOptions> = Join<
  Remove<[Options$Length<O>, Options$Pattern<O>, Options$Format<O>], "">,
  " "
>;

export type Str<Schema extends TStringOptions, Tag extends string, Key extends string> = $Atom<
  Schema,
  number,
  Tag,
  Key,
  Option$TagInfo<Schema>
>;

export const Str: <const OptionsOrDefault extends TStringOptions | number>(
  optionsOrDefault?: OptionsOrDefault,
) => <Tag extends string, Key extends string = Tag>(
  Tag: Tag,
  Key?: Key,
) => Str<
  TStringOptions | number extends OptionsOrDefault
    ? {}
    : OptionsOrDefault extends number
      ? { default: OptionsOrDefault }
      : OptionsOrDefault,
  Tag,
  Key
> = (optionsOrDefault?) =>
  createAtom(
    a(
      {
        type: "string",
      },
      typeof optionsOrDefault === "string" ? { default: optionsOrDefault } : optionsOrDefault,
    ),
  ) as never;

export default Str;

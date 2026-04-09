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

type Option$$META<O extends TStringOptions> = Join<
  Remove<[Options$Length<O>, Options$Pattern<O>, Options$Format<O>], "">,
  " "
>;

export type Str<Schema extends TStringOptions, $TYP extends string, $KEY extends string> = $Atom<
  Schema,
  string,
  $TYP,
  $KEY,
  Option$$META<Schema>
>;

export const Str: <const OptionsOrDefault extends TStringOptions | number>(
  optionsOrDefault?: OptionsOrDefault,
) => <$TYP extends string, $KEY extends string = $TYP>(
  $TYP: $TYP,
  $KEY?: $KEY,
) => Str<
  TStringOptions | number extends OptionsOrDefault
    ? {}
    : OptionsOrDefault extends number
      ? { default: OptionsOrDefault }
      : OptionsOrDefault,
  $TYP,
  $KEY
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

import type { TNumberOptions } from "typebox";
import { $Atom, createAtom } from "./_";
import { __ } from "~types";
import { a } from "jsyoyo";

type Option$Min<O extends TNumberOptions> = O extends { minimum: infer Min extends number | bigint }
  ? `[${Min},`
  : O extends { exclusiveMinimum: infer Min extends number | bigint }
    ? `(${Min},`
    : "(-∞,";
type Option$Max<O extends TNumberOptions> = O extends { maximum: infer Max extends number | bigint }
  ? `${Max}]`
  : O extends { exclusiveMaximum: infer Max extends number | bigint }
    ? `${Max})`
    : "∞)";
type Options$MultipleOf<O extends TNumberOptions, Prefix extends string = ""> = O extends {
  multipleOf: infer N extends number | bigint;
}
  ? `${Prefix}x${N}`
  : "";
type Range$KEYs = keyof Pick<TNumberOptions, "minimum" | "maximum" | "exclusiveMinimum" | "exclusiveMaximum">;
type Option$$META<O extends TNumberOptions> =
  Extract<keyof O, Range$KEYs> extends never
    ? Options$MultipleOf<O> extends ""
      ? __
      : Options$MultipleOf<O>
    : `${Option$Min<O>}${Option$Max<O>}${Options$MultipleOf<O, " ">}`;

export type Num<Schema extends TNumberOptions, $TYP extends string, $KEY extends string> = $Atom<
  Schema,
  number,
  $TYP,
  $KEY,
  Option$$META<Schema>
>;

export const Num: <const OptionsOrDefault extends TNumberOptions | number>(
  optionsOrDefault?: OptionsOrDefault,
) => <$TYP extends string, $KEY extends string = $TYP>(
  $TYP: $TYP,
  $KEY?: $KEY,
) => Num<
  TNumberOptions | number extends OptionsOrDefault
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
        type: "number",
      },
      typeof optionsOrDefault === "number" ? { default: optionsOrDefault } : optionsOrDefault,
    ),
  ) as never;

export const Int: <const OptionsOrDefault extends TNumberOptions | number>(
  optionsOrDefault?: OptionsOrDefault,
) => <$TYP extends string, $KEY extends string = $TYP>(
  $TYP: $TYP,
  $KEY?: $KEY,
) => Num<
  TNumberOptions | number extends OptionsOrDefault
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
        type: "integer",
      },
      typeof optionsOrDefault === "number" ? { default: optionsOrDefault } : optionsOrDefault,
    ),
  ) as never;

export default Num;

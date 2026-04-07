import type { TNumberOptions } from "typebox";
import { $Atom, createAtom } from "./_";
import { __ } from "~types";
import { a } from "objoy";

type Option$Min<O extends TNumberOptions> = O extends { minimum: infer Min extends number }
  ? `[${Min},`
  : O extends { exclusiveMinimum: infer Min extends number }
    ? `(${Min},`
    : "(-∞,";
type Option$Max<O extends TNumberOptions> = O extends { maximum: infer Max extends number }
  ? `${Max}]`
  : O extends { exclusiveMaximum: infer Max extends number }
    ? `${Max})`
    : "∞)";
type Options$MultipleOf<O extends TNumberOptions, Prefix extends string = ""> = O extends {
  multipleOf: infer N extends number;
}
  ? `${Prefix}x${N}`
  : "";
type RangeKeys = keyof Pick<TNumberOptions, "minimum" | "maximum" | "exclusiveMinimum" | "exclusiveMaximum">;
type Option$TagInfo<O extends TNumberOptions> =
  Extract<keyof O, RangeKeys> extends never
    ? Options$MultipleOf<O> extends ""
      ? __
      : Options$MultipleOf<O>
    : `${Option$Min<O>}${Option$Max<O>}${Options$MultipleOf<O, " ">}`;

export type Num<Schema extends TNumberOptions, Tag extends string, Key extends string> = $Atom<
  Schema,
  number,
  Tag,
  Key,
  Option$TagInfo<Schema>
>;

export const Num: <const OptionsOrDefault extends TNumberOptions | number>(
  optionsOrDefault?: OptionsOrDefault,
) => <Tag extends string, Key extends string = Tag>(
  Tag: Tag,
  Key?: Key,
) => Num<
  TNumberOptions | number extends OptionsOrDefault
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
        type: "number",
      },
      typeof optionsOrDefault === "number" ? { default: optionsOrDefault } : optionsOrDefault,
    ),
  ) as never;

export default Num;

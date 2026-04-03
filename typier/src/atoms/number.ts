import { Number, TNumberOptions } from "typebox";
import { AtomWithInfo, createAtom, $Atom } from "./_";
import { __ } from "~types";
import { a } from "objoy";

type Option$Min<O extends TNumberOptions> = O extends { minimum: infer Min extends number }
  ? `[${Min},`
  : O extends { exclusiveMinimum: infer Min extends number }
    ? `(${Min},`
    : "(-inf,";
type Option$Max<O extends TNumberOptions> = O extends { minimum: infer Max extends number }
  ? `${Max}]`
  : O extends { exclusiveMaximum: infer Max extends number }
    ? `${Max})`
    : "+inf)";
type Options$MultipleOf<O extends TNumberOptions> = O extends {
  multipleOf: infer N extends number;
}
  ? `/${N}`
  : "";
type Option$TagInfo<O extends TNumberOptions> =
  | O["minimum"]
  | O["maximum"]
  | O["exclusiveMinimum"]
  | O["exclusiveMaximum"] extends number
  ? `${Option$Min<O>}${Option$Max<O>} ${Options$MultipleOf<O>}`
  : Options$MultipleOf<O> extends ""
    ? __
    : Options$MultipleOf<O>;

type Num<Schema extends TNumberOptions, Tag extends string, Key extends string> = AtomWithInfo<
  Schema & { "~kind": "Unsafe" },
  number,
  Tag,
  Key,
  Option$TagInfo<Schema>
>;

export const Num = <
  OptionsOrDefault extends TNumberOptions | number,
  O extends TNumberOptions = OptionsOrDefault extends number ? { default: OptionsOrDefault } : OptionsOrDefault,
>(
  optionsOrDefault = {} as OptionsOrDefault,
): $Atom<O & { "~kind": "Unsafe" }, number, Option$TagInfo<O>> =>
  createAtom(
    a(
      {
        type: "number",
        "~kind": "Unsafe",
      },
      typeof optionsOrDefault === "number" ? { default: optionsOrDefault } : optionsOrDefault,
    ),
  ) as never;

export default Num;

import type { TSchemaOptions } from "typebox";
import { $Atom, createAtom } from "./0";
import { __ } from "~types";
import { a } from "jsyoyo";

export type Bool<Schema extends TSchemaOptions, $TYP extends string, $KEY extends string> = $Atom<
  Schema,
  boolean,
  $TYP,
  $KEY,
  __
>;

export const Bool: <const OptionsOrDefault extends TSchemaOptions | boolean>(
  optionsOrDefault?: OptionsOrDefault,
) => <$TYP extends string, $KEY extends string = $TYP>(
  $TYP: $TYP,
  $KEY?: $KEY,
) => Bool<
  TSchemaOptions | boolean extends OptionsOrDefault
    ? {}
    : OptionsOrDefault extends boolean
      ? { default: OptionsOrDefault }
      : OptionsOrDefault,
  $TYP,
  $KEY
> = (optionsOrDefault?) =>
  createAtom(
    a(
      {
        type: "boolean",
      },
      typeof optionsOrDefault === "boolean" ? { default: optionsOrDefault } : optionsOrDefault,
    ),
  ) as never;

export default Bool;

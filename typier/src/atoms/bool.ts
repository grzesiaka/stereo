import type { TSchemaOptions } from "typebox";
import { $Atom, createAtom } from "./0";
import { __ } from "~types";
import { a } from "jsyoyo";

export type BOOL<
  Schema extends TSchemaOptions = {},
  $TYP extends string = string,
  $KEY extends string = string,
> = $Atom<Schema, boolean, $TYP, $KEY, __> & { type: "boolean" };

/**
 * Create a boolean atom
 * @param optionsOrDefault
 * @returns
 */
export const Bool: <const OptionsOrDefault extends TSchemaOptions | boolean>(
  optionsOrDefault?: OptionsOrDefault,
) => <$TYP extends string, $KEY extends string = $TYP>(
  $TYP: $TYP,
  $KEY?: $KEY,
) => BOOL<
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

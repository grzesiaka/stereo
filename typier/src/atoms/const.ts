import { TSchemaOptions } from "typebox";
import { createAtom, $Atom } from "./0";
import { a } from "jsyoyo";

export type ConstConstraint = string | number | boolean;
type ConstConstraint$Typeof<C> = C extends string
  ? "string"
  : C extends number
    ? "number"
    : C extends boolean
      ? "boolean"
      : never;

export type Const<
  Value extends ConstConstraint,
  Options extends TSchemaOptions,
  $TYP extends string,
  $KEY extends string,
> = $Atom<
  Options & {
    type: ConstConstraint$Typeof<Value>;
    const: Value;
  },
  Value,
  $TYP,
  $KEY,
  undefined
>;

type CreateConst = <const Value extends ConstConstraint, const Options extends TSchemaOptions>(
  value: Value,
  options?: Options,
) => <$TYP extends string, $KEY extends string = $TYP>(
  $TYP: $TYP,
  $KEY?: $KEY,
) => Const<Value, TSchemaOptions extends Options ? {} : Options, $TYP, $KEY>;

/**
 * Create Const / Literal atom
 * @param value
 * @param options
 * @returns
 */
export const Const: CreateConst = (value, options?) =>
  createAtom(
    a(
      {
        "~kind": "Literal",
        const: value,
        type: typeof value,
      },
      options,
    ),
  ) as never;

export default Const;

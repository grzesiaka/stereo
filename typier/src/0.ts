import { Static as TBStatic } from "typebox";
import { __ } from "~types";

/** Used instead of Typebox's TSchema `{}` as the latter accepts `TSchema[]` as `TSchema`, which results in `unknown` inferred type */
export interface TSchema {
  type: string;
}

/**
 * A type definition
 */
export interface TypierBase<$TYP extends string = string, $KEY extends string = $TYP> extends TSchema {
  /**
   * Unique identifier of the type
   */
  $TYP: $TYP;
  /**
   * Key used when this type is combined in an object. Defaults to `$TYP`.
   */
  $KEY: $KEY;
}

export type Static<T extends TSchema, WithOptions extends boolean = false> =
  | TBStatic<T>
  | (WithOptions extends false ? never : T extends { "~optional": true } ? __ : never);

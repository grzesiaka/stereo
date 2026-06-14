import { __ } from "~types";

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

import { __ } from "~types";

/**
 * A type definition
 */
export interface TypierBase<$TYP extends string = string, $KEY extends string = $TYP> {
  /**
   * Unique identifier of the type
   */
  $TYP: $TYP;
  /**
   * Key used when this type is combined in an object. Defaults to `$TYP`.
   */
  $KEY: $KEY;
}

export type ResolveKey<$KEY extends string, $NEW_KEY extends string> = $NEW_KEY extends `?`
  ? $KEY extends `?${string}`
    ? $KEY
    : `?${$KEY}`
  : $NEW_KEY;

export const resolveKey = <$KEY extends string, $NEW_KEY extends string>(key: $KEY, newKey: $NEW_KEY) =>
  newKey === "?" ? (key[0] === "?" ? key : `?${key}`) : newKey;

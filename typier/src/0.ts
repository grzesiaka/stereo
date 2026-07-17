import { Static as TBStatic } from "typebox";
import { __, ARR } from "~types";

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

export type Static<T extends TSchema, WithOptions extends boolean = true> =
  | TBStatic<T>
  | (WithOptions extends false ? never : T extends { "~optional": true } ? __ : never);

export type StaticArr<Ts extends ARR<TSchema>, WithOptions extends boolean = true> = Ts extends readonly [
  infer H extends TSchema,
  ...infer R extends ARR<TSchema>,
]
  ? [Static<H, WithOptions>, ...StaticArr<R, WithOptions>]
  : [];

export const isTypier = (t: unknown): t is TypierBase =>
  typeof t === "object" && t !== null && "$TYP" in t && "$KEY" in t;

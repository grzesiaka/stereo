import { TypierBase } from "../0";
import { resolveKey, ResolveKey } from "../_";
import { TRefine, Static, TSchema } from "typebox";
import { __, Tagged, WithTag } from "~types";

type Rekey<Schema extends object, Type, $TYP extends string, $KEY extends string, $META> = <const K extends string>(
  key: K,
) => Custom<Schema, Type, $TYP, ResolveKey<$KEY, K>, $META>;

export type Custom<T extends TSchema, X, $TYP extends string, $KEY extends string, $META> = Omit<
  T,
  "$TYP" | "$KEY" | "$"
> &
  TRefine<{
    "~kind": "Unsafe";
    "~hint": __ extends $META ? WithTag<X, $TYP> : Tagged<X, $TYP, $META>;
  }> &
  TypierBase<$TYP, $KEY> & {
    $: Rekey<T, X, $TYP, $KEY, $META>;
  } & ($KEY extends `?${string}` ? { "~optional": true } : {});

export const Custom =
  <T, S extends TSchema = {}, $META = __>(
    refine: (v: T & Static<NoInfer<S>>) => boolean,
    message = "Incorrect value",
    Schema = {} as S,
  ) =>
  <const $TYP extends string, const $KEY extends string = $TYP>($TYP: $TYP, $KEY = $TYP as never as $KEY) =>
    ({
      ...Schema,
      ...(($KEY[0] === "?" ? { "~optional": true } : {}) as {}),
      $TYP,
      $KEY: $KEY.replace(/^\?/, "") || ($KEY ? $TYP : ""),
      "~refine": [{ refine, message }],
      $: ($NEW_KEY: string) => Custom(refine, message, Schema)($TYP, resolveKey($KEY, $NEW_KEY)),
    }) as never as Custom<S, T, $TYP, $KEY, $META>;

export default Custom;

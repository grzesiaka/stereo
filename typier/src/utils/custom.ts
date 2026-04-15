import { TypierBase } from "../0";
import { resolveKey, ResolveKey } from "../_";
import { TRefine, Static, TSchema } from "typebox";
import { __ } from "~types";

type Rekey<Schema extends object, Type, $TYP extends string, $KEY extends string, $META> = <const K extends string>(
  key: K,
) => Custom<Schema, Type, $TYP, ResolveKey<$KEY, K>, $META>;

export type Custom<T extends TSchema, X, $TYP extends string, $KEY extends string, $META> = TRefine<
  Omit<T, "$TYP" | "$KEY" | "$">
> &
  TypierBase<$TYP, $KEY> & {
    $: Rekey<T, X, $TYP, $KEY, $META>;
  } & ($KEY extends `?${string}` ? { "~optional": true } : {});

export const Custom =
  <T, S extends TSchema = {}, $META = __>(
    refine: (v: T & Static<NoInfer<S>>) => boolean,
    S = {} as S,
    msg = "Incorrect input",
  ) =>
  <const $TYP extends string, const $KEY extends string = $TYP>($TYP: $TYP, $KEY = $TYP as never as $KEY) =>
    ({
      ...S,
      ...(($KEY[0] === "?" ? { "~optional": true } : {}) as {}),
      $TYP,
      $KEY: $KEY.replace(/^\?/, "") || ($KEY ? $TYP : ""),
      "~refine": [refine, msg],
      $: ($NEW_KEY: string) => Custom(refine, S, msg)($TYP, resolveKey($KEY, $NEW_KEY)),
    }) as never as Custom<S, T, $TYP, $KEY, $META>;

export default Custom;
